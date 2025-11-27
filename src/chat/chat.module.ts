import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationEntity } from 'src/entities/conversation.entity';
import { JwtService } from '@nestjs/jwt';
import { TLoggers } from 'src/services/enums';
import { ServiceLevelLogger } from 'src/infrastructure';
import { MessageEntity } from 'src/entities/message.entity';
import { UserEntity } from 'src/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ConversationEntity, MessageEntity, UserEntity]),
  ],
  controllers: [ChatController],
  providers: [
    ChatService,
    ChatGateway,
    JwtService,

    {
      provide: TLoggers.chat,
      useValue: new ServiceLevelLogger(TLoggers.chat),
    },
  ],
  exports: [
    {
      provide: TLoggers.chat,
      useValue: new ServiceLevelLogger(TLoggers.chat),
    },
    ChatService,
    ChatGateway,
  ],
})
export class ChatModule {}
