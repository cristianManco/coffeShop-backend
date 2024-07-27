import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { ILike, Repository } from 'typeorm';
import { CreateProductDto, UpdateProductDto } from '../dtos';
import { Category } from 'src/modules/categories/entities/category.entity';
import { ObjectResponse } from 'src/libs/utils/interfaces/object-response.interface';
import { res } from 'src/libs/utils/res';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(product: CreateProductDto): Promise<ObjectResponse<Product>> {
    try {
      const category = await this.categoryRepository.findOne({
        where: { id: product.id_category },
      });

      if (!category) {
        throw new NotFoundException(
          res(false, `Category with ID ${product.id_category} not found`, null),
        );
      }

      const newProduct = await this.productRepository.create(product);
      newProduct.category = category;
      const productSaved = await this.productRepository.save(newProduct);

      const productWithRelations = await this.productRepository.findOne({
        where: { id: productSaved.id },
        relations: ['category'],
      });

      return await res(
        true,
        'Product created successfully',
        productWithRelations,
      );
    } catch (error) {
      throw error;
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<ObjectResponse<Product[]>> {
    try {
      const [products, total] = await this.productRepository.findAndCount({
        skip: (page - 1) * limit,
        take: limit,
        relations: ['category'],
      });
      return await res(true, 'Products found', { products, total });
    } catch (error) {
      throw error;
    }
  }

  async getProductById(id: number): Promise<ObjectResponse<Product>> {
    try {
      const product = await this.productRepository.findOne({
        where: { id },
        relations: ['category'],
      });

      if (!product) {
        throw new NotFoundException(
          res(false, `Product with ID ${id} not found`, null),
        );
      }

      return await res(true, 'Product found by id', product);
    } catch (error) {
      throw error;
    }
  }

  async findProductsByName(
    name: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<ObjectResponse<Product[]>> {
    try {
      const [products, total] = await this.productRepository.findAndCount({
        where: { name: ILike(`%${name}%`) },
        skip: (page - 1) * limit,
        take: limit,
        relations: ['category'],
      });

      if (products.length === 0) {
        throw new NotFoundException(
          res(false, `Product with name ${name} not found`, null),
        );
      }

      return await res(true, 'Products found', { products, total });
    } catch (error) {
      throw error;
    }
  }

  async updateProduct(
    id: number,
    product: UpdateProductDto,
  ): Promise<ObjectResponse<Product>> {
    try {
      const productExists = await this.productRepository.findOne({
        where: { id },
        relations: ['category'],
      });

      if (!productExists) {
        throw new NotFoundException(
          res(false, `Product with ID ${id} not found`, null),
        );
      }

      if (product.id_category) {
        const category = await this.categoryRepository.findOne({
          where: { id: product.id_category },
        });
        if (!category) {
          throw new NotFoundException(
            res(
              false,
              `Category with ID ${product.id_category} not found`,
              null,
            ),
          );
        }
        productExists.category = category;
      }

      await this.productRepository.save({ ...productExists, ...product });

      const productUpdated = await this.productRepository.findOne({
        where: { id },
        relations: ['category'],
      });
      return await res(true, 'Product updated successfully', productUpdated);
    } catch (error) {
      throw error;
    }
  }

  async deleteProduct(id: number): Promise<ObjectResponse<Product>> {
    try {
      const productExists = await this.productRepository.findOne({
        where: { id },
        relations: ['category'],
      });

      if (!productExists) {
        throw new NotFoundException(
          res(false, `Product with ID ${id} not found`, null),
        );
      }

      await this.productRepository.softDelete(id);
      return await res(true, 'Product deleted successfully', productExists);
    } catch (error) {
      throw error;
    }
  }
}
