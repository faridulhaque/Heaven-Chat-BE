import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConversationEntity } from 'src/entities/conversation.entity';
import { MessageEntity } from 'src/entities/message.entity';
import { UserEntity } from 'src/entities/user.entity';
import { ServiceLevelLogger } from 'src/infrastructure';
import { TLoggers } from 'src/services/enums';
import { TMessageDataFE } from 'src/services/types';
import { Not, Raw, Repository } from 'typeorm';

@Injectable()
export class ChatService {
  constructor(
    @Inject(TLoggers.chat)
    private logger: ServiceLevelLogger,
    @InjectRepository(ConversationEntity)
    private readonly conversationRepository: Repository<ConversationEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
  ) {}

  async startConversation(members: string[]): Promise<ConversationEntity> {
    console.log('members', members);
    try {
      this.logger.verbose('Starting a conversation');

      const conversation = await this.conversationRepository.findOne({
        where: {
          members: Raw((alias) => `${alias} @> '${JSON.stringify(members)}'`),
        },
      });

      if (conversation) return conversation;

      const newConversation = this.conversationRepository.create({
        members,
      });

      const saved = await this.conversationRepository.save(newConversation);
      this.logger.log('Conversation saved');
      return saved;
    } catch (error) {
      this.logger.error(error.message || 'Failed to create conversation');
      throw new HttpException(
        error?.message || 'Failed to create conversation',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async saveMessage(data: TMessageDataFE): Promise<MessageEntity> {
    try {
      this.logger.verbose('Message is saving');

      const message = this.messageRepository.create({
        type: data.type,
        from: data.from,
        to: data.to,
        message: data.message,
        conversation: { conversationId: data.conversationId },
      });

      await this.messageRepository.save(message);
      this.logger.log('Message has been saved');
      await this.conversationRepository.update(
        { conversationId: data.conversationId },
        { lastMessage: data.message },
      );
      this.logger.log('lasMessage has been saved');

      return message;
    } catch (error) {
      this.logger.error(error.message || 'Failed to save messages');
      throw new HttpException(
        error.message || 'Failed to save messages',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getConversations(memberId: string): Promise<any> {
    this.logger.verbose('Finding all conversations for user', memberId);
    try {
      const conversations = await this.conversationRepository.find({
        where: {
          members: Raw((alias) => `${alias} @> '["${memberId}"]'`),
          deletedBy: Not(Raw((alias) => `${alias} @> '["${memberId}"]'`)),
        },
        order: {
          updatedAt: 'DESC',
        },
      });

      this.logger.log('Conversations found, count:', conversations?.length);

      const data: any = [];
      for (const c of conversations) {
        const counterPartyId = c.members.find((c: string) => c !== memberId);
        this.logger.debug('Fetching conversation counter party');
        const counterParty = await this.userRepository.findOne({
          where: {
            userId: counterPartyId,
          },
        });

        (c as any).counterParty = counterParty;
        data.push(c);
      }
      this.logger.log('Returning conversation');
      return data;
    } catch (error: any) {
      this.logger.error(error.message || 'Failed to fetch conversations');
      throw new HttpException(
        error?.message || 'Failed to fetch conversation',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async getOneConversation(
    loggedInUserId: string,
    conversationId: string,
  ): Promise<ConversationEntity> {
    try {
      this.logger.verbose('Searching for conversation');
      const conversation = await this.conversationRepository.findOne({
        where: {
          conversationId,
        },
      });
      if (!conversation)
        throw new HttpException('Conversation not found', HttpStatus.NOT_FOUND);
      const counterPartyId = conversation?.members.find(
        (m: string) => m !== loggedInUserId,
      );
      this.logger.debug('Conversation found');
      const counterParty = await this.userRepository.findOne({
        where: {
          userId: counterPartyId,
        },
      });
      (conversation as any).counterParty = counterParty;
      return conversation;
    } catch (error: any) {
      this.logger.error(error.message || 'Error finding conversation');
      throw new HttpException(
        error.message || 'Error while finding convo',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async getMessages(conversationId: string): Promise<MessageEntity[]> {
    try {
      this.logger.verbose('Searching for messages');

      const messages = await this.messageRepository.find({
        where: {
          conversation: {
            conversationId,
          },
        },
        order: {
          createdAt: 'DESC',
        },
      });

      return messages;
    } catch (error: any) {
      this.logger.error(error.message || 'Error finding conversation');
      throw new HttpException(
        error.message || 'Error while finding convo',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async switchBlockUser(
    blockerId: string,
    blockedId: string,
  ): Promise<boolean> {
    this.logger.verbose('Checking for blocked users');

    try {
      const user = await this.userRepository.findOne({
        where: { userId: blockerId },
        select: { userId: true, blocked: true },
      });

      if (!user) return false;

      user.blocked = user.blocked || [];

      const isBlocked = user.blocked.includes(blockedId);
      let updated: any;

      if (isBlocked) {
        this.logger.debug('user is blocked, unblocking now');
        const filtered = user.blocked.filter((b) => b !== blockedId);
        updated = await this.userRepository.update(
          { userId: blockerId },
          { blocked: filtered },
        );
      } else {
        this.logger.debug('user is unblocked, blocking now');
        const updatedList = [...user.blocked, blockedId];
        updated = await this.userRepository.update(
          { userId: blockerId },
          { blocked: updatedList },
        );
      }

      if (updated.affected > 0) {
        this.logger.log('block position updated');
        return true;
      }
    } catch (error) {
      this.logger.error(error.message || 'Error while blocking/unblocking');
      throw new HttpException(
        error.message || 'Error while blocking/unblocking',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return false;
  }

  async checkBlocked(members: string[]): Promise<boolean> {
    try {
      this.logger.debug('first check if blocked');

      const firstCheck = await this.userRepository.findOne({
        where: {
          userId: members[0],
          blocked: Raw((alias) => `${alias} @> :blockedId`, {
            blockedId: JSON.stringify([members[1]]),
          }),
        },
      });

      this.logger.debug('Second check if blocked');

      const oppositeCheck = await this.userRepository.findOne({
        where: {
          userId: members[1],
          blocked: Raw((alias) => `${alias} @> :blockedId`, {
            blockedId: JSON.stringify([members[0]]),
          }),
        },
      });

      const isBlocked = Boolean(firstCheck || oppositeCheck);

      this.logger.log(`check done result: ${isBlocked}`);

      return isBlocked;
    } catch (error: any) {
      this.logger.error(error.message || 'Failed to check blocks');
      throw new HttpException(
        'Failed to check blocks',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteChat(userId: string, conversationId: string): Promise<boolean> {
    try {
      this.logger.debug('deleting conversation');

      const conversation = await this.conversationRepository.findOne({
        where: {
          conversationId,
        },
        select: {
          conversationId: true,
          deletedBy: true,
        },
      });
      if (!conversation)
        throw new HttpException('Conversation not found', HttpStatus.NOT_FOUND);

      const deleted = conversation.deletedBy || [];
      deleted.push(userId);
      conversation.deletedBy = deleted;
      const saved = await this.conversationRepository.save(conversation);
      if (saved) return true;
      else return false;
    } catch (error: any) {
      this.logger.error(error.message || 'Failed to delete a chat');
      throw new HttpException(
        'Failed to delete chat',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
