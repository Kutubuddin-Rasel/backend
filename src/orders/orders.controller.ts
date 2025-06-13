import { Controller, Post, Body, Get, Param, UseGuards, Request, Patch } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

// Customer-facing endpoints
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Roles('customer')
  @Post()
  create(@Request() req, @Body() dto: CreateOrderDto) {
    return this.ordersService.create(req.user.id, dto);
  }

  @Roles('customer')
  @Get()
  findAll(@Request() req) {
    return this.ordersService.findAllForUser(req.user.id);
  }

  @Roles('customer')
  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.ordersService.findOneForUser(req.user.id, id);
  }
}

// Seller-facing endpoints
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('seller/orders')
export class SellerOrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Roles('seller')
  @Get()
  findAll(@Request() req) {
    return this.ordersService.findAllForVendor(req.user.id);
  }

  @Roles('seller')
  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.ordersService.findOneForVendor(req.user.id, id);
  }

  @Roles('seller')
  @Patch(':id')
  updateStatus(@Request() req, @Param('id') id: string, @Body() dto: UpdateOrderDto) {
    return this.ordersService.updateStatus(req.user.id, id, dto);
  }
}