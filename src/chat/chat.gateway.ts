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
import { ChatService } from './chat.service';

@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  path: '/socket.io',
  pingInterval: 25000,
  pingTimeout: 60000,
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private userSockets = new Map<string, string>();
  private busyUsers = new Map<string, boolean>();

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
    const { id: userId } = await this.validateJWT(token);

    if (userId) {
      client.data.userId = userId;
      this.userSockets.set(userId, client.id);

      this.logger.debug(`User ${userId} connected with socket ${client.id}`);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.warn(`Client disconnected: ${client.id}`);
  }

  broadcastNewUser(payload: any) {
    this.server.emit('new-user', payload);
  }

  @SubscribeMessage('private-message')
  async handleMessage(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    const { to } = data;

    console.log('message', client.id);

    await this.chatService.saveMessage({
      message: data.message.message,
      type: data.message.type,
      to: data.message.to,
      from: client.data.userId,
      conversationId: data.message.conversationId,
    });

    const recipientSocketId = this.userSockets.get(to);
    if (!recipientSocketId) {
      this.logger.warn('recipient socket id not found');
      return;
    }
    this.server.to(recipientSocketId).emit('private-message', {
      message: data.message.message,
      type: data.message.type,
      to: data.message.to,
      from: client.data.userId,
      conversationId: data.message.conversationId,
    });
  }

  @SubscribeMessage('join')
  handleJoin(@MessageBody() userId: string, @ConnectedSocket() client: Socket) {
    client.join(userId);
  }

  @SubscribeMessage('signal')
  handleSignal(@MessageBody() data: any) {
    if (data.datas.type === 'offer') {
      if (this.busyUsers.get(data.to)) {
        this.server.to(data.from).emit('busy', {});
        return;
      }
      this.busyUsers.set(data.from, true);
      this.busyUsers.set(data.to, true);
    }

    this.server
      .to(data.to)
      .emit('signal', { from: data.from, data: data.data });
  }

  @SubscribeMessage('end_call')
  handleEndCall(@MessageBody() data: any) {
    this.server.to(data.to).emit('end_call', { from: data.from });
    this.busyUsers.set(data.from, false);
    this.busyUsers.set(data.to, false);
  }

  validateJWT(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: this.envConfig.getJwtSecret(),
      });
    } catch (error) {
      throw new HttpException(
        error?.message || 'Invalid Token',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
