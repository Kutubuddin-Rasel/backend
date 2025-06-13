// src/cart/cart.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from './entities/cart-item.entity';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartItem) private cartRepo: Repository<CartItem>,
  ) {}

  async findAll(userId: string): Promise<CartItem[]> {
    return this.cartRepo.find({
      where: { userId },
      relations: ['product'],
    });
  }

  async upsert(userId: string, dto: CreateCartItemDto): Promise<CartItem> {
    let item = await this.cartRepo.findOne({
      where: { userId, productId: dto.productId },
    });
    if (item) {
      item.quantity += dto.quantity;
    } else {
      item = this.cartRepo.create({ userId, ...dto });
    }
    return this.cartRepo.save(item);
  }

  async update(userId: string, id: string, dto: UpdateCartItemDto): Promise<CartItem> {
    const item = await this.cartRepo.findOne({ where: { id, userId } });
    if (!item) throw new NotFoundException('Cart item not found');
    item.quantity = dto.quantity;
    return this.cartRepo.save(item);
  }

  async remove(userId: string, id: string): Promise<void> {
    const item = await this.cartRepo.findOne({ where: { id, userId } });
    if (!item) throw new NotFoundException('Cart item not found');
    await this.cartRepo.remove(item);
  }

  async clear(userId: string): Promise<void> {
    await this.cartRepo.delete({ userId });
  }
}
