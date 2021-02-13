import { createNodeRedisClient } from 'handy-redis';
import { IMsg } from '../types';

export class RedisHandler {
  private redisClient;
  constructor() {
    this.redisClient = createNodeRedisClient('redis://redisdb:6379');
  }

  public saveMsg(roomName: string, msg: IMsg) {
    return this.redisClient.rpush(roomName, JSON.stringify(msg));
  }

  public async getMessagesForGivenRoom(roomName: string) {
    try {
      const messagesForChannel = await this.redisClient.lrange(roomName, 0, -1);
      if (!messagesForChannel) {
        return [];
      } else {
        const messages: Array<IMsg> = [];
        messagesForChannel.forEach((msg) => {
          messages.push(JSON.parse(msg));
        });
        return messages;
      }
    } catch (err) {
      throw err;
    }
  }

  public deleteChannel(roomName: string): void {
    this.redisClient.del(roomName).catch((err) => {
      throw err;
    });
  }
}
