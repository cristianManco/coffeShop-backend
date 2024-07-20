import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../entities/order.entity';
import { Repository } from 'typeorm';
import { OrderDetail } from '../entities/order-detail.entity';
import { Product } from 'src/modules/products/entities/product.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { CreateOrderDto, UpdateOrderDto } from '../dtos';
import { ObjectResponse } from 'src/utils/interfaces/object-response.interface';
import { res } from 'src/utils/res';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderDetail)
    private readonly orderDetailRepository: Repository<OrderDetail>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createOrder(
    createOrderDto: CreateOrderDto,
  ): Promise<ObjectResponse<Order>> {
    try {
      const { user_id, order_details } = createOrderDto;
      const user = await this.userRepository.findOne({
        where: { id: user_id },
      });

      if (!user) {
        throw new NotFoundException(
          res(false, `User with id ${user_id} not found`, null),
        );
      }

      const order = new Order();
      order.order_date = new Date();
      order.user = user;

      let totalAmount = 0;
      const orderDetails: OrderDetail[] = [];
      for (const detail of order_details) {
        const product = await this.productRepository.findOne({
          where: { id: detail.product_id },
        });

        if (!product) {
          throw new NotFoundException(
            res(false, `Product with id ${detail.product_id} not found`, null),
          );
        }

        if (detail.quantity > product.stock) {
          throw new BadRequestException(
            res(false, `Insufficient stock for product ${product.name}`, null),
          );
        }

        const orderDetail = new OrderDetail();
        orderDetail.product = product;
        orderDetail.quantity = detail.quantity;
        orderDetail.order = order;

        orderDetails.push(orderDetail);

        totalAmount += product.price * detail.quantity;
      }

      const createdOrder = await this.orderRepository.manager.transaction(
        async (transactionalEntityManager) => {
          order.total_amount = totalAmount;
          order.orderDetails = orderDetails;

          await Promise.all(
            orderDetails.map(async (detail) => {
              const product = detail.product;
              product.stock -= detail.quantity;
              await transactionalEntityManager.save(product);
            }),
          );
          const savedOrder = await transactionalEntityManager.save(order);
          await transactionalEntityManager.save(orderDetails);

          return savedOrder;
        },
      );

      const responseOrder = {
        ...createdOrder,
        orderDetails: createdOrder.orderDetails.map((detail) => {
          const { order, ...detailWithoutOrder } = detail;
          return detailWithoutOrder;
        }),
      };

      return res(true, 'Order created successfully', responseOrder);
    } catch (error) {
      throw error;
    }
  }

  async findAllOrders(
    page: number = 1,
    limit: number = 10,
  ): Promise<ObjectResponse<Order[]>> {
    try {
      const [orders, total] = await this.orderRepository.findAndCount({
        skip: (page - 1) * limit,
        take: limit,
        relations: ['user', 'orderDetails', 'orderDetails.product'],
      });

      return res(true, 'Orders retrieved successfully', { orders, total });
    } catch (error) {}
  }

  async updateOrder(
    id: number,
    updateOrderDto: UpdateOrderDto,
  ): Promise<ObjectResponse<Order>> {
    try {
      const orderToUpdate = await this.orderRepository.findOne({
        where: { id },
        relations: ['user', 'orderDetails'],
      });

      if (!orderToUpdate) {
        throw new NotFoundException(
          res(false, `Order with id ${id} not found`, null),
        );
      }

      if (updateOrderDto.user_id) {
        const userExists = await this.userRepository.findOne({
          where: { id: updateOrderDto.user_id },
        });
        if (!userExists) {
          throw new NotFoundException(
            res(
              false,
              `User with id ${updateOrderDto.user_id} not found`,
              null,
            ),
          );
        }
        orderToUpdate.user = userExists;
      }

      if (updateOrderDto.order_details) {
        const orderDetailsToUpdate: OrderDetail[] = [];

        for (const detail of updateOrderDto.order_details) {
          const product = await this.productRepository.findOne({
            where: { id: detail.product_id },
          });

          if (!product) {
            throw new NotFoundException(
              res(
                false,
                `Product with id ${detail.product_id} not found`,
                null,
              ),
            );
          }

          if (detail.quantity > product.stock) {
            throw new BadRequestException(
              res(
                false,
                `Insufficient stock for product ${product.name}`,
                null,
              ),
            );
          }

          let orderDetail = orderToUpdate.orderDetails.find(
            (od) => od.product && od.product.id === product.id,
          );

          if (!orderDetail) {
            orderDetail = new OrderDetail();
            orderDetail.product = product;
            orderDetail.order = orderToUpdate;
          }
          orderDetail.quantity = detail.quantity;

          orderDetailsToUpdate.push(orderDetail);
        }

        // Remove old order details
        const oldOrderDetails = orderToUpdate.orderDetails.filter(
          (od) => !orderDetailsToUpdate.includes(od),
        );
        await this.orderDetailRepository.remove(oldOrderDetails);

        // Update with new order details
        orderToUpdate.orderDetails = orderDetailsToUpdate;
      }

      // Update status if provided
      if (updateOrderDto.status) {
        orderToUpdate.status = updateOrderDto.status;
      }

      let totalAmount = 0;
      for (const detail of orderToUpdate.orderDetails) {
        if (detail.product) {
          totalAmount += detail.product.price * detail.quantity;
        }
      }
      orderToUpdate.total_amount = totalAmount;

      const updatedOrder = await this.orderRepository.save(orderToUpdate);

      const simpleOrder = {
        ...updatedOrder,
        orderDetails: updatedOrder.orderDetails.map((detail) => ({
          ...detail,
          order: undefined,
        })),
      };

      return res(true, 'Order updated successfully', simpleOrder);
    } catch (error) {
      throw error;
    }
  }

  async deleteOrder(id: number): Promise<ObjectResponse<Order>> {
    try {
      const orderToDelete = await this.orderRepository.findOne({
        where: { id },
        relations: ['orderDetails', 'orderDetails.product'],
      });

      if (!orderToDelete) {
        throw new NotFoundException(
          res(false, `Order with id ${id} not found`, null),
        );
      }

      for (const detail of orderToDelete.orderDetails) {
        const product = detail.product;
        if (product) {
          product.stock += detail.quantity;
          await this.productRepository.save(product);
        }
        await this.orderDetailRepository.softDelete(detail.id);
      }

      await this.orderRepository.softDelete(id);
      return res(true, 'Order deleted successfully', orderToDelete);
    } catch (error) {
      throw error;
    }
  }
}
