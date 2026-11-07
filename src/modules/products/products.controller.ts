import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { UserRole } from '../../common/enums/user-role.enum.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { CreateProductDto } from './dtos/create-product.dto.js';
import { Product } from './entities/product.entity.js';
import { ProductsService } from './products.service.js';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly products: ProductsService) {}
  @Get() @Public() findAll(): Promise<Product[]> {
    return this.products.findAll();
  }
  @Get(':id') @Public() findOne(@Param('id') id: string): Promise<Product> {
    return this.products.findOne(id);
  }
  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STORE)
  create(@Body() dto: CreateProductDto): Promise<Product> {
    return this.products.create(dto);
  }
}
