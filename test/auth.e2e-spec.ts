import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from '../src/app.module.js';
import { configureApplication } from '../src/app.factory.js';

process.env.DATABASE_TYPE = 'better-sqlite3';
process.env.DATABASE_PATH = ':memory:';
process.env.REDIS_URL = '';

describe('Marketplace flow (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = configureApplication(module.createNestApplication());
    await app.init();
  });

  afterEach(async () => app.close());

  it('registers, authenticates, creates a product and places an order', async () => {
    const admin = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        email: 'admin@ibi.test',
        password: 'Admin!123',
        role: 'ADMIN',
        firstName: 'Admin',
        lastName: 'IBI',
      })
      .expect(201);
    const buyer = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        email: 'buyer@ibi.test',
        password: 'Buyer!123',
        role: 'BUYER',
        firstName: 'Buyer',
        lastName: 'IBI',
        phone: '11999999999',
      })
      .expect(201);
    expect(buyer.body.data.user.phone).toBe('11999999999');
    const adminToken = admin.body.data.accessToken;
    const buyerToken = buyer.body.data.accessToken;
    const product = await request(app.getHttpServer())
      .post('/api/v1/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Cesta IBI', priceInCents: 1299, stock: 3 })
      .expect(201);
    await request(app.getHttpServer())
      .get('/api/v1/products')
      .expect(200)
      .expect(({ body }) => expect(body.data).toHaveLength(1));
    const order = await request(app.getHttpServer())
      .post('/api/v1/orders')
      .set('Authorization', `Bearer ${buyerToken}`)
      .send({ items: [{ productId: product.body.data.id, quantity: 2 }] })
      .expect(201);
    expect(order.body.data.totalInCents).toBe(2598);
    expect(order.body.data.status).toBe('PENDING');
    await request(app.getHttpServer())
      .delete(`/api/v1/users/${buyer.body.data.user.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(204);
    await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'buyer@ibi.test', password: 'Buyer!123' })
      .expect(401);
  });
});
