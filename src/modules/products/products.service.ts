import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CacheService } from '../../cache/cache.service.js';
import { CreateProductDto } from './dtos/create-product.dto.js';
import { Product } from './entities/product.entity.js';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private readonly products: Repository<Product>,
    private readonly cache: CacheService,
  ) {}
  async create(dto: CreateProductDto): Promise<Product> {
    const product = await this.products.save(
      this.products.create({
        name: dto.name,
        description: dto.description ?? null,
        priceInCents: dto.priceInCents,
        stock: dto.stock,
        category: dto.category ?? 'general',
      }),
    );
    await this.cache.delete(this.listKey());
    return product;
  }
  async findAll(): Promise<Product[]> {
    const cached = await this.cache.get<Product[]>(this.listKey());
    if (cached) return cached;
    const products = await this.products.find({ order: { createdAt: 'DESC' } });
    await this.cache.set(this.listKey(), products);
    return products;
  }
  async findOne(id: string): Promise<Product> {
    const product = await this.products.findOneBy({ id });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }
  private listKey(): string {
    return 'products:list';
  }
}
