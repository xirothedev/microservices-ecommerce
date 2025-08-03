import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private readonly client: Redis;

  constructor(private readonly configService: ConfigService) {
    this.client = new Redis({
      host: this.configService.get<string>('REDIS_HOST'),
      port: Number(this.configService.get<string>('REDIS_PORT')),
      password: this.configService.get<string>('REDIS_PASSWORD'),
      lazyConnect: false,
      connectTimeout: 1000,
      maxLoadingRetryTime: 1,
    });
  }

  getClient(): Redis {
    return this.client;
  }

  async set(key: string, value: string, expireSeconds?: number): Promise<void> {
    if (expireSeconds) {
      await this.client.set(key, value, 'EX', expireSeconds);
    } else {
      await this.client.set(key, value);
    }
  }

  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  async getOrSet(key: string, callback: () => Promise<any>, expireSeconds?: number): Promise<any> {
    const cachedData = await this.get(key);
    if (cachedData) return JSON.parse(cachedData);

    const freshData = await callback();
    await this.set(key, JSON.stringify(freshData), expireSeconds);
    return freshData;
  }

  async setObject(key: string, value: any, expireSeconds?: number): Promise<void> {
    await this.set(key, JSON.stringify(value), expireSeconds);
  }

  async getObject<T>(key: string): Promise<T | null> {
    const data = await this.get(key);
    if (!data) return null;
    try {
      return JSON.parse(data) as T;
    } catch {
      return null;
    }
  }

  async deleteKey(key: string): Promise<number> {
    return await this.client.del(key);
  }

  async deletePattern(pattern: string): Promise<number> {
    const keys = await this.client.keys(pattern);
    if (keys.length === 0) return 0;
    return await this.client.del(keys);
  }
}
