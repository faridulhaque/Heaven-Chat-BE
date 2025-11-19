import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TLoggers } from 'src/services/enums';
import { ServiceLevelLogger } from 'src/infrastructure';
import { JwtService } from '@nestjs/jwt';
import { ChatGateway } from 'src/chat/chat.gateway';
import { ChatService } from 'src/chat/chat.service';
import { ConversationEntity } from 'src/entities/conversation.entity';
import { MessageEntity } from 'src/entities/message.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, ConversationEntity, MessageEntity]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,

    {
      provide: TLoggers.auth,
      useValue: new ServiceLevelLogger(TLoggers.auth),
    },
    {
      provide: TLoggers.chat,
      useValue: new ServiceLevelLogger(TLoggers.chat),
    },
    ChatGateway,
    JwtService,
    ChatService,
  ],
})
export class AuthModule {}
