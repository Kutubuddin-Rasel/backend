import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ProductsService } from '../products/products.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Injectable()
export class OrdersService {
 constructor(
  @InjectRepository(Order) private ordersRepo: Repository<Order>,
  @InjectRepository(OrderItem) private itemsRepo: Repository<OrderItem>,
  private productsService: ProductsService,      // <— here
  private notificationsGateway: NotificationsGateway,
) {}

  // src/orders/orders.service.ts
async create(userId: string, dto: CreateOrderDto): Promise<Order> {
  // Load items (now using findOneById)
  const items = await Promise.all(
    dto.items.map(async ({ productId, quantity }) => {
      const product = await this.productsService.findOneById(productId);
      return { product, quantity, unitPrice: Number(product.price) };
    }),
  );

  const vendorId = items[0].product.vendorId;
  const totalAmount = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

  // Create the order shell
  const order = this.ordersRepo.create({ userId, vendorId, totalAmount, items: [] });
  const savedOrder = await this.ordersRepo.save(order);

  // Create order items
  const orderItems = items.map(({ product, quantity, unitPrice }) =>
    this.itemsRepo.create({ orderId: savedOrder.id, productId: product.id, quantity, unitPrice }),
  );
  await this.itemsRepo.save(orderItems);

  // Re-fetch full order
  const fullOrder = await this.ordersRepo.findOne({
    where: { id: savedOrder.id },
    relations: ['items', 'items.product'],
  });
  if (!fullOrder) throw new NotFoundException('Created order could not be retrieved');

  // Notify seller
  this.notificationsGateway.notifyOrderUpdate(vendorId, {
    orderId: fullOrder.id,
    status: fullOrder.status,
  });

  return fullOrder;
}


  async findAllForUser(userId: string): Promise<Order[]> {
    return this.ordersRepo.find({ where: { userId }, relations: ['items', 'items.product'] });
  }

  async findAllForVendor(vendorId: string): Promise<Order[]> {
    return this.ordersRepo.find({ where: { vendorId }, relations: ['items', 'items.product'] });
  }

  async findOneForUser(userId: string, id: string): Promise<Order> {
    const order = await this.ordersRepo.findOne({ where: { id, userId }, relations: ['items', 'items.product'] });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async findOneForVendor(vendorId: string, id: string): Promise<Order> {
    const order = await this.ordersRepo.findOne({ where: { id, vendorId }, relations: ['items', 'items.product'] });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async updateStatus(vendorId: string, id: string, dto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOneForVendor(vendorId, id);
    order.status = dto.status;
    const updated = await this.ordersRepo.save(order);
    this.notificationsGateway.notifyOrderUpdate(vendorId, { orderId: id, status: dto.status });
    return updated;
  }
}