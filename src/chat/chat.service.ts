import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConversationEntity } from 'src/entities/conversation.entity';
import { MessageEntity } from 'src/entities/message.entity';
import { ServiceLevelLogger } from 'src/infrastructure';
import { TLoggers } from 'src/services/enums';
import { TMessageData } from 'src/services/types';
import { Raw, Repository } from 'typeorm';

@Injectable()
export class ChatService {
  constructor(
    @Inject(TLoggers.chat)
    private logger: ServiceLevelLogger,
    @InjectRepository(ConversationEntity)
    private readonly conversationRepository: Repository<ConversationEntity>,
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
  ) {}

  async startConversation(members: string[]): Promise<ConversationEntity> {
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

  async saveMessage(
    conversationId: string,
    data: TMessageData,
  ): Promise<MessageEntity> {
    try {
      this.logger.verbose('Message is saving');

      const message = this.messageRepository.create({
        type: data.type,
        senderId: data.senderId,
        recipientId: data.recipientId,
        message: data.message,
        conversation: { conversationId },
      });

      await this.messageRepository.save(message);

      this.logger.log('Message has been saved');
      return message;
    } catch (error) {
      this.logger.error(error.message || 'Failed to save messages');
      throw new HttpException(
        error.message || 'Failed to save messages',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
