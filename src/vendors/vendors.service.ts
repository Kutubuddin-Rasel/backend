import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VendorProfile } from './entities/vendor-profile.entity';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';

@Injectable()
export class VendorsService {
  constructor(
    @InjectRepository(VendorProfile)
    private vendorsRepo: Repository<VendorProfile>,
  ) {}

  async create(userId: string, dto: CreateVendorDto): Promise<VendorProfile> {
    const vendor = this.vendorsRepo.create({ userId, ...dto });
    return this.vendorsRepo.save(vendor);
  }

  async findByUser(userId: string): Promise<VendorProfile> {
    const vendor = await this.vendorsRepo.findOne({ where: { userId } });
    if (!vendor) throw new NotFoundException('Vendor profile not found');
    return vendor;
  }

  async update(userId: string, dto: UpdateVendorDto): Promise<VendorProfile> {
    const vendor = await this.findByUser(userId);
    Object.assign(vendor, dto);
    return this.vendorsRepo.save(vendor);
  }
}