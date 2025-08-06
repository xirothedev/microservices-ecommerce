import { RedisService } from '@/redis/redis.service';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class UserStatusService {
  private readonly logger = new Logger(UserStatusService.name);

  constructor(private readonly redisService: RedisService) {}

  async setUserOnline(userId: string) {
    const previousStatus = await this.getUserStatus(userId);
    await this.redisService.set(`user:${userId}:status`, 'online');

    // Add user to online set
    await this.redisService.getClient().sadd('users:online', userId);

    // Publish status change event
    await this.redisService.publishObject('user:status:changed', {
      userId,
      status: 'online',
      previousStatus,
      timestamp: new Date().toISOString(),
    });

    this.logger.log(`User ${userId} set to online`);
  }

  async setUserOffline(userId: string) {
    const previousStatus = await this.getUserStatus(userId);
    await this.redisService.set(`user:${userId}:status`, 'offline');

    // Remove user from online set
    await this.redisService.getClient().srem('users:online', userId);

    // Publish status change event
    await this.redisService.publishObject('user:status:changed', {
      userId,
      status: 'offline',
      previousStatus,
      timestamp: new Date().toISOString(),
    });

    this.logger.log(`User ${userId} set to offline`);
  }

  async getUserStatus(userId: string) {
    const status = await this.redisService.get(`user:${userId}:status`);
    return status || 'offline';
  }

  async getOnlineUsers(): Promise<string[]> {
    return await this.redisService.getClient().smembers('users:online');
  }

  async isUserOnline(userId: string): Promise<boolean> {
    const result = await this.redisService.getClient().sismember('users:online', userId);
    return result === 1;
  }

  async getOnlineUsersCount(): Promise<number> {
    return await this.redisService.getClient().scard('users:online');
  }
}
