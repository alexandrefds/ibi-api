import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { OrderItem } from '../modules/orders/entities/order-item.entity.js';
import { Order } from '../modules/orders/entities/order.entity.js';
import { Product } from '../modules/products/entities/product.entity.js';
import { UserProfile } from '../modules/users/entities/user-profile.entity.js';
import { User } from '../modules/users/entities/user.entity.js';
import { InitialSchema1700000000000 } from './migrations/1700000000000-initial-schema.js';
import { AddUsersSoftDelete1700000000001 } from './migrations/1700000000001-add-users-soft-delete.js';

const entities = [User, UserProfile, Product, Order, OrderItem];
const migrations = [
  InitialSchema1700000000000,
  AddUsersSoftDelete1700000000001,
];

const dataSource =
  process.env.DATABASE_TYPE === 'postgres'
    ? new DataSource({
        type: 'postgres',
        host: process.env.DATABASE_HOST,
        port: Number(process.env.DATABASE_PORT ?? 5432),
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        entities,
        migrations,
      })
    : new DataSource({
        type: 'better-sqlite3',
        database: process.env.DATABASE_PATH ?? 'ibi.sqlite',
        entities,
        migrations,
      });

export default dataSource;
