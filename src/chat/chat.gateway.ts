import { HttpException, HttpStatus, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {
  EnvironmentConfigService,
  ServiceLevelLogger,
} from 'src/infrastructure';
import { TLoggers } from 'src/services/enums';
import { TMessageDataFE } from 'src/services/types';
import { ChatService } from './chat.service';

@WebSocketGateway({ namespace: 'chat' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    @Inject(TLoggers.chat)
    private logger: ServiceLevelLogger,
    private readonly jwtService: JwtService,
    private readonly envConfig: EnvironmentConfigService,
    private readonly chatService: ChatService,
  ) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    const token = client.handshake.auth.token;
    const { id } = await this.validateJWT(token);
    if (id) {
      this.logger.debug('Client Connected, id:', id);
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    const { to, message, type, conversationId } = data as TMessageDataFE;
    const recipient = this.server.sockets.sockets.get(to);

    if (recipient) {
      const savedMessage = await this.chatService.saveMessage(conversationId, {
        senderId: client.id,
        recipientId: to,
        message,
        type,
      });

      if (savedMessage?.messageId) {
        recipient.emit('message', savedMessage);
      }
    } else {
      this.logger.warn(`Target socket ${to} not found`);
    }
  }

  validateJWT(token: string): any {
    try {
      const jwtOptions = {
        secret: this.envConfig.getJwtSecret(),
      };
      const decode = this.jwtService.verify(token, jwtOptions);
      return decode;
    } catch (error) {
      throw new HttpException(
        error?.message || 'Invalid Token',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
