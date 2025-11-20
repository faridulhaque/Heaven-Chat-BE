import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { StartConversationDto } from 'src/dto/StartConversationDto';
import { AuthGuard } from 'src/infrastructure/guards/authGuard';
import type { RequestWithUser } from 'src/services/types';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(AuthGuard)
  @Post('/start')
  async startConversation(@Body() body: StartConversationDto) {
    return await this.chatService.startConversation(body.members);
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
}
