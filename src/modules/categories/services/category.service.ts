import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../entities/category.entity';
import { ILike, Repository } from 'typeorm';
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos';
import { ObjectResponse } from 'src/utils/interfaces/object-response.interface';
import { res } from 'src/utils/res';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async createCategory(
    category: CreateCategoryDto,
  ): Promise<ObjectResponse<Category>> {
    try {
      const newCategory = this.categoryRepository.create(category);
      const categorySaved = await this.categoryRepository.save(newCategory);
      return res(true, 'Category created successfully', categorySaved);
    } catch (error) {
      throw error;
    }
  }

  async findAllCategories(
    page: number = 1,
    limit: number = 10,
  ): Promise<ObjectResponse<Category[]>> {
    try {
      const [categories, total] = await this.categoryRepository.findAndCount({
        skip: (page - 1) * limit,
        take: limit,
      });
      return res(true, 'Categories found', { categories, total });
    } catch (error) {
      throw error;
    }
  }

  async findCategoryByName(
    name: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<ObjectResponse<Category[]>> {
    try {
      const [category, total] = await this.categoryRepository.findAndCount({
        where: { name: ILike(`%${name}%`) },
        skip: (page - 1) * limit,
        take: limit,
      });

      if (category.length === 0) {
        return res(false, 'Category not found', category);
      }

      return res(true, 'Category found', { category, total });
    } catch (error) {
      throw error;
    }
  }

  async updateCategory(
    id: number,
    category: UpdateCategoryDto,
  ): Promise<ObjectResponse<Category>> {
    try {
      const categoryExists = await this.categoryRepository.findOne({
        where: { id },
      });

      if (!categoryExists) {
        throw new NotFoundException(
          res(false, `Category with ${id} not found`, null),
        );
      }

      await this.categoryRepository.update(id, category);
      const categoryUpdated = await this.categoryRepository.findOne({
        where: { id },
      });
      return res(true, 'Category updated successfully', categoryUpdated);
    } catch (error) {
      throw error;
    }
  }

  async deleteCategory(id: number): Promise<ObjectResponse<Category>> {
    try {
      const categoryExists = await this.categoryRepository.findOne({
        where: { id },
      });

      if (!categoryExists) {
        throw new NotFoundException(
          res(false, `Category with ${id} not found`, null),
        );
      }

      await this.categoryRepository.softDelete(id);
      return res(true, 'Category deleted successfully', categoryExists);
    } catch (error) {
      throw error;
    }
  }
}
