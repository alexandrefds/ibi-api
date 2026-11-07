import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../products/entities/product.entity.js';
import { User } from '../users/entities/user.entity.js';
import { CreateOrderDto } from './dtos/create-order.dto.js';
import { Order, OrderStatus } from './entities/order.entity.js';
import { OrderItem } from './entities/order-item.entity.js';

@Injectable()
export class OrdersService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Order) private readonly orders: Repository<Order>,
  ) {}
  async create(buyerId: string, dto: CreateOrderDto): Promise<Order> {
    return this.dataSource.transaction(async (manager) => {
      const user = await manager.findOneBy(User, { id: buyerId });
      if (!user) throw new NotFoundException('User not found');
      const productIds = dto.items.map((item) => item.productId);
      const products = await manager
        .getRepository(Product)
        .createQueryBuilder('product')
        .where('product.id IN (:...productIds)', { productIds })
        .getMany();
      if (products.length !== productIds.length)
        throw new NotFoundException('One or more products not found');
      const byId = new Map(products.map((product) => [product.id, product]));
      const items = dto.items.map((input) => {
        const product = byId.get(input.productId)!;
        if (product.stock < input.quantity)
          throw new BadRequestException(
            `Insufficient stock for ${product.name}`,
          );
        product.stock -= input.quantity;
        return manager.create(OrderItem, {
          product,
          quantity: input.quantity,
          unitPriceInCents: product.priceInCents,
        });
      });
      await manager.save(products);
      const order = manager.create(Order, {
        buyer: user,
        status: OrderStatus.PENDING,
        totalInCents: items.reduce(
          (total, item) => total + item.unitPriceInCents * item.quantity,
          0,
        ),
        items,
      });
      return manager.save(order);
    });
  }
  async findForBuyer(id: string, buyerId: string): Promise<Order> {
    const order = await this.orders.findOne({
      where: { id, buyer: { id: buyerId } },
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }
}
