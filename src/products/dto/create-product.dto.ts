import { IsString, IsNumber, IsInt, Min, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateVendorDto } from '../../vendors/dto/create-vendor.dto';

class SpecificationDto {
  @IsString() key: string;
  @IsString() value: string;
}

export class CreateProductDto {
  @IsString() name: string;
  @IsString() description: string;
  @IsNumber() price: number;
  @IsString() sku: string;
  @IsInt() @Min(0) stock: number;
  @IsInt() @Min(0) threshold: number;
  @IsOptional() @IsString() primaryImage?: string;
  @IsOptional() @IsArray() @ValidateNested({ each: true })
  @Type(() => SpecificationDto)
  specifications?: SpecificationDto[];
  @IsOptional() @IsArray() @IsString({ each: true })
  tags?: string[]; // tag names
}