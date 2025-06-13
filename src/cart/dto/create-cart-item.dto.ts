// src/cart/dto/create-cart-item.dto.ts
import { IsUUID, IsInt, Min } from 'class-validator';

export class CreateCartItemDto {
  @IsUUID() productId: string;
  @IsInt() @Min(1) quantity: number;
}


