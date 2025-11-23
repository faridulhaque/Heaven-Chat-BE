import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { StartConversationDto } from 'src/dto/StartConversationDto';
import { AuthGuard } from 'src/infrastructure/guards/authGuard';
import type { RequestWithUser } from 'src/services/types';
import { CheckBlockDto } from 'src/dto/CheckBlockDto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(AuthGuard)
  @Post('/start')
  async startConversation(@Body() body: StartConversationDto) {
    return await this.chatService.startConversation(body.members);
  }

  @UseGuards(AuthGuard)
  @Get('/blocked')
  async checkIfBlocked(@Query() dto: CheckBlockDto) {
    return await this.chatService.checkBlocked(dto.members);
  }

  @UseGuards(AuthGuard)
  @Get('/list')
  async getChatList(@Req() request: RequestWithUser) {
    return await this.chatService.getConversations(request.user.userId);
  }

  @UseGuards(AuthGuard)
  @Get('/conversation/:conversationId')
  @SetMetadata('statusCode', 201)
  async getConversation(
    @Req() request: RequestWithUser,
    @Param('conversationId') conversationId: string,
  ) {
    return await this.chatService.getOneConversation(
      request.user.userId,
      conversationId,
    );
  }

  @UseGuards(AuthGuard)
  @Get('/:conversationId/messages')
  @SetMetadata('statusCode', 201)
  async getMessages(@Param('conversationId') conversationId: string) {
    return await this.chatService.getMessages(conversationId);
  }

  @UseGuards(AuthGuard)
  @Get('/users')
  @SetMetadata('statusCode', 201)
  async getAllUsers(@Req() request: RequestWithUser) {
    return await this.chatService.getUsersAll(request.user.userId);
  }

  @UseGuards(AuthGuard)
  @Put('/block/:blockedUserId')
  @SetMetadata('statusCode', 200)
  async switchBlockUser(
    @Req() request: RequestWithUser,
    @Param('blockedUserId') blockedUserId: string,
  ) {
    return await this.chatService.switchBlockUser(
      request.user.userId,
      blockedUserId,
    );
  }

  @UseGuards(AuthGuard)
  @Delete('/conversation/:conversationId')
  @SetMetadata('statusCode', 200)
  async deleteChat(
    @Req() request: RequestWithUser,
    @Param('conversationId') conversationId: string,
  ) {
    return await this.chatService.deleteChat(
      request.user.userId,
      conversationId,
    );
  }
}
