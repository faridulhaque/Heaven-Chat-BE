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
  private onlineUsers = new Map<string, boolean>();

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
      this.onlineUsers.set(userId, true);

      this.logger.debug(`User ${userId} connected with socket ${client.id}`);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.warn(`Client disconnected: ${client.id}`);
    if (client.data.userId) {
      this.onlineUsers.set(client.data.userId, false);
      this.busyUsers.set(client.data.userId, false); // ← ADD THIS LINE
    }
  }

  @SubscribeMessage('is_online')
  checkOnline(
    @MessageBody() userId: string,
    @ConnectedSocket() client: Socket,
  ) {
    const isOnline = this.onlineUsers.get(userId) === true;
    client.emit('is_online', isOnline);
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
    console.log('JOIN:', userId, 'client:', client.id);
    client.join(userId);
  }

  @SubscribeMessage('signal')
  handleSignal(@MessageBody() data: any) {
    this.logger.debug(`handleSignal received: ${JSON.stringify(data)}`);

    if (data.type === 'offer') {
      if (this.busyUsers.get(data.to)) {
        this.server.to(data.from).emit('busy', {});
        return;
      }

      this.busyUsers.set(data.from, true);
      this.busyUsers.set(data.to, true);
    }

    console.log('emitting to:', data.to);

    this.server.to(data.to).emit('signal', {
      from: data.from,
      data: data.data,
      callerName: data.callerName,
    });
  }

  @SubscribeMessage('end_call')
  handleEndCall(@MessageBody() data: any) {
    this.server.to(data.to).emit('end_call', { from: data.from });
    this.logger.log('call ended');
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
