import { Order } from 'src/modules/orders/entities/order.entity';
import { Product } from 'src/modules/products/entities/product.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('order_details')
export class OrderDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unit_price: number;

  @ManyToOne(() => Order, (order) => order.orderDetails)
  @JoinColumn({ name: 'id_order' })
  order: Order;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'id_product' })
  product: Product;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date;
}
