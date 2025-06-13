import { Controller, Get, Post, Body, Patch, UseGuards, Request } from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('vendors')
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @Roles('seller')
  @Post('profile')
  create(@Request() req, @Body() dto: CreateVendorDto) {
    return this.vendorsService.create(req.user.id, dto);
  }

  @Roles('seller')
  @Get('profile')
  findMy(@Request() req) {
    return this.vendorsService.findByUser(req.user.id);
  }

  @Roles('seller')
  @Patch('profile')
  update(@Request() req, @Body() dto: UpdateVendorDto) {
    return this.vendorsService.update(req.user.id, dto);
  }
}