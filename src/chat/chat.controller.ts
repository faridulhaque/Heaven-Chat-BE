import { Body, Controller } from '@nestjs/common';
import { ChatService } from './chat.service';
import { StartConversationDto } from 'src/dto/StartConversationDto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  async startConversation(@Body() body: StartConversationDto) {
    return await this.chatService.startConversation(body.members);
  }
}
