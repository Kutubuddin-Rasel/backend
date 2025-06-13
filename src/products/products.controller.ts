import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Roles('seller')
  @Post()
  create(@Request() req, @Body() dto: CreateProductDto) {
    return this.productsService.create(req.user.id, dto);
  }

  @Roles('seller')
  @Get('vendor')
  findAllForVendor(@Request() req) {
    return this.productsService.findAllForVendor(req.user.id);
  }

  @Roles('customer')
  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Roles('seller')
  @Get('vendor/:id')
  findOneForVendor(@Request() req, @Param('id') id: string) {
    return this.productsService.findOneForVendor(req.user.id, id);
  }

  @Roles('customer','seller')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Roles('seller')
  @Patch(':id')
  update(@Request() req, @Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(req.user.id, id, dto);
  }

  @Roles('seller')
  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.productsService.remove(req.user.id, id);
  }
}
