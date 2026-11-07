import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';
import { configureApplication } from './../src/app.factory.js';

process.env.DATABASE_TYPE = 'better-sqlite3';
process.env.DATABASE_PATH = ':memory:';
process.env.REDIS_URL = '';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = configureApplication(moduleFixture.createNestApplication());
    await app.init();
  });

  it('/api/v1/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/v1/health')
      .expect(200)
      .expect(({ body }) => expect(body.data).toEqual({ status: 'ok' }));
  });

  afterEach(async () => {
    await app.close();
  });
});
