import { IsIn } from 'class-validator';
import { OrderStatus } from '../entities/order.entity';

export class UpdateOrderDto {
  @IsIn(['pending','processing','shipped','delivered','cancelled'])
  status: OrderStatus;
}