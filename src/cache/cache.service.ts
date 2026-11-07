import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  get<T>(key: string): Promise<T | undefined> {
    return this.cache.get<T>(key);
  }
  async set<T>(key: string, value: T, ttl = 60_000): Promise<void> {
    await this.cache.set(key, value, ttl);
  }
  async delete(key: string): Promise<void> {
    await this.cache.del(key);
  }
}
