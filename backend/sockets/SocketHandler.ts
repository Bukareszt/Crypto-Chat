import { Server, Socket } from 'socket.io';
import http from 'http';
import { RedisHandler } from '../redis/RedisHandler';
import { IMsg } from '../types';
import { CryptoHandler } from '../crypto/CryptoHandler';

export class ChatHandler {
  private io: Server;
  private roomName: string = '';
  private redisHandler: RedisHandler;
  constructor(server: http.Server) {
    this.redisHandler = new RedisHandler();
    this.io = new Server(server, {
      cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
      },
    });
    this.redisHandler = new RedisHandler();
    this.listen();
  }

  private handleChatHistory(socket: Socket) {
    return this.redisHandler
      .getMessagesForGivenRoom(this.roomName)
      .then((chatHistory) => {
        socket.emit('chat-history', chatHistory);
      });
  }

  private async getUsersCount() {
    const users = await this.io.in(this.roomName).allSockets();
    return users.size;
  }

  private async handleSendingMsg(socket: Socket, msg: IMsg) {
    try {
      socket.to(this.roomName).broadcast.emit('chat-message', msg);
      await this.redisHandler.saveMsg(this.roomName, msg);
    } catch (err) {
      console.log(err);
    }
  }

  private async handleConnection(socket: Socket) {
    const room: any = socket.handshake.query;
    this.roomName = room['roomName'];
    socket.join(this.roomName);
    const usersCount = await this.getUsersCount();
    this.io.to(this.roomName).emit('users-count', usersCount);
  }

  private async handleCrypto(socket: Socket) {
    const qrCodesForFrontend = await CryptoHandler.generateQrCodeWithKeys();
    socket.emit('qr-code', qrCodesForFrontend);
  }

  private async handleDisconnecting() {
    const usersCount = await this.getUsersCount();
    this.io.to(this.roomName).emit('users-count', usersCount - 1);
    this.handleDeletingChat(usersCount - 1);
  }

  private handleDeletingChat(users: number) {
    if (users === 0) {
      this.redisHandler.deleteChannel(this.roomName);
    }
  }

  private listen() {
    this.io.on('connection', (socket: Socket) => {
      this.handleConnection(socket);
      this.handleCrypto(socket);
      this.handleChatHistory(socket);

      socket.on('send-chat-message', async (msg: IMsg) => {
        await this.handleSendingMsg(socket, msg);
      });

      socket.on('delete-messages', () => {
        this.redisHandler.deleteChannel(this.roomName);
        socket.broadcast.emit('chat-delete');
      });

      socket.on('disconnecting', async () => {
        this.handleDisconnecting();
      });
    });
  }
}
