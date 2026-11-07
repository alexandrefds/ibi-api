import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import type { JwtPayload } from '../auth/strategies/jwt.strategy.js';
import { CreateOrderDto } from './dtos/create-order.dto.js';
import { Order } from './entities/order.entity.js';
import { OrdersService } from './orders.service.js';
@ApiTags('orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}
  @Post() create(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateOrderDto,
  ): Promise<Order> {
    return this.orders.create(user.sub, dto);
  }
  @Get(':id') findOne(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
  ): Promise<Order> {
    return this.orders.findForBuyer(id, user.sub);
  }
}
