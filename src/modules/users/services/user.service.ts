import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { ILike, Repository } from 'typeorm';
import { ObjectResponse } from 'src/utils/interfaces/object-response.interface';
import { res } from 'src/utils/res';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async createUser(user: CreateUserDto): Promise<ObjectResponse<User>> {
    try {
      const userExist = await this.userRepository.findOne({
        where: { email: user.email },
      });
      if (userExist) {
        throw new HttpException(
          res(false, 'Email already exist', null),
          HttpStatus.CONFLICT,
        );
      }

      const emailExists = await this.userRepository.findOne({
        where: { email: user.email },
        withDeleted: true,
      });

      if (emailExists) {
        throw new HttpException(
          res(false, 'Email already exists. Contact support.', null),
          HttpStatus.CONFLICT,
        );
      }
      const userSaved = await this.userRepository.save(user);
      return res(true, 'User created', userSaved);
    } catch (error) {
      throw error;
    }
  }

  async findUserByEmail(email: string): Promise<ObjectResponse<User>> {
    try {
      const user = await this.userRepository.findOne({
        where: { email: email },
      });
      if (!user) {
        throw new NotFoundException(
          res(false, `User with email ${email} not found`, null),
        );
      }

      return res(true, 'User found', user);
    } catch (error) {
      throw error;
    }
  }

  async findUsersByName(
    name: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<ObjectResponse<User[]>> {
    try {
      const [users, total] = await this.userRepository.findAndCount({
        where: { name: ILike(`%${name}%`) },
        skip: (page - 1) * limit,
        take: limit,
      });
      if (users.length === 0) {
        throw new NotFoundException(
          res(false, `User with name "${name}" not found`, null),
        );
      }

      return res(true, `Users with name "${name}" found`, { users, total });
    } catch (error) {
      throw error;
    }
  }

  async findAllUsers(
    page: number = 1,
    limit: number = 10,
  ): Promise<ObjectResponse<User[]>> {
    try {
      const [users, total] = await this.userRepository.findAndCount({
        skip: (page - 1) * limit,
        take: limit,
      });
      return res(true, 'Users found', { users, total });
    } catch (error) {
      throw error;
    }
  }

  async updatedUser(
    id: number,
    user: UpdateUserDto,
  ): Promise<ObjectResponse<User>> {
    try {
      const userExist = await this.userRepository.findOne({
        where: { id },
      });

      if (!userExist) {
        throw new NotFoundException(
          res(false, `User with id ${id} not found`, null),
        );
      }

      const emailExist = await this.userRepository.findOne({
        where: { email: user.email },
      });
      if (emailExist && user.email !== userExist.email) {
        throw new HttpException(
          res(false, 'Email already exists', null),
          HttpStatus.CONFLICT,
        );
      }

      await this.userRepository.update(id, user);
      return res(true, 'User updated', user);
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(id: number): Promise<ObjectResponse<User>> {
    try {
      const userExist = await this.userRepository.findOne({
        where: { id },
      });
      if (!userExist) {
        throw new NotFoundException(
          res(false, `User with id ${id} not found`, null),
        );
      }

      const userDeleted = await this.userRepository.softDelete(id);
      return res(true, 'User deleted', userDeleted);
    } catch (error) {
      throw error;
    }
  }
}
