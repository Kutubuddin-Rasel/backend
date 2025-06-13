import { IsString, IsOptional } from 'class-validator';

export class CreateVendorDto {
  @IsString()
  storeName: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  logoUrl?: string;
}