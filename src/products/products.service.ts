import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { VendorsService } from '../vendors/vendors.service';
import { Tag } from './entities/tag.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productsRepo: Repository<Product>,
    @InjectRepository(Tag) private tagsRepo: Repository<Tag>,
    private vendorsService: VendorsService,
  ) {}

  // Seller-specific: get vendorId
  private async getVendorId(userId: string): Promise<string> {
    const vendorProfile = await this.vendorsService.findByUser(userId);
    return vendorProfile.id;
  }

  // Seller-only creation
  async create(userId: string, dto: CreateProductDto): Promise<Product> {
    const vendorId = await this.getVendorId(userId);
    let tags: Tag[] = [];
    if (dto.tags) {
      tags = await Promise.all(
        dto.tags.map(async (name) => {
          let tag = await this.tagsRepo.findOne({ where: { name } });
          if (!tag) tag = this.tagsRepo.create({ name });
          return tag;
        }),
      );
    }
    const product = this.productsRepo.create({ vendorId, ...dto, tags });
    return this.productsRepo.save(product);
  }

  // Seller-only listing
  async findAllForVendor(userId: string): Promise<Product[]> {
    const vendorId = await this.getVendorId(userId);
    return this.productsRepo.find({ where: { vendorId }, relations: ['specifications', 'tags'] });
  }

  // Global listing for customers
  async findAll(): Promise<Product[]> {
    return this.productsRepo.find({ relations: ['specifications', 'tags'] });
  }

  // Seller-only retrieve
  async findOneForVendor(userId: string, id: string): Promise<Product> {
    const vendorId = await this.getVendorId(userId);
    const product = await this.productsRepo.findOne({ where: { vendorId, id }, relations: ['specifications', 'tags'] });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  // Public retrieve
  async findOne(id: string): Promise<Product> {
    const product = await this.productsRepo.findOne({ where: { id }, relations: ['specifications', 'tags'] });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  // Seller-only update
  async update(userId: string, id: string, dto: UpdateProductDto): Promise<Product> {
    const product = await this.findOneForVendor(userId, id);
    Object.assign(product, dto);
    return this.productsRepo.save(product);
  }

  // Seller-only remove
  async remove(userId: string, id: string): Promise<void> {
    const product = await this.findOneForVendor(userId, id);
    await this.productsRepo.remove(product);
  }
  
   async findOneById(id: string): Promise<Product> {
    const product = await this.productsRepo.findOne({ where: { id } });
    if (!product) throw new NotFoundException(`Product ${id} not found`);
    return product;
  }
}