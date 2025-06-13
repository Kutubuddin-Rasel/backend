// src/cart/cart.controller.ts
import {
  Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Roles('customer')
  @Get()
  findAll(@Request() req) {
    return this.cartService.findAll(req.user.id);
  }

  @Roles('customer')
  @Post()
  upsert(@Request() req, @Body() dto: CreateCartItemDto) {
    return this.cartService.upsert(req.user.id, dto);
  }

  @Roles('customer')
  @Patch(':id')
  update(@Request() req, @Param('id') id: string, @Body() dto: UpdateCartItemDto) {
    return this.cartService.update(req.user.id, id, dto);
  }

  @Roles('customer')
  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.cartService.remove(req.user.id, id);
  }

  @Roles('customer')
  @Delete()
  clear(@Request() req) {
    return this.cartService.clear(req.user.id);
  }
}
