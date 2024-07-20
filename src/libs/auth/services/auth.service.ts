import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/modules/users/services/user.service';
import { TokenService } from './token.service';
import { HashService } from './hash.service';
import { RegisterDto } from '../dtos/register-user.dto';
import { ObjectResponse } from 'src/utils/interfaces/object-response.interface';
import { User } from 'src/modules/users/entities/user.entity';
import { Tokens } from '../types/toke.type';
import { res } from 'src/utils/res';
import { LoginDto } from '../dtos/login-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly hashService: HashService,
  ) {}

  async register(registerDto: RegisterDto): Promise<ObjectResponse<User>> {
    const userFound = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (userFound) {
      throw new HttpException(
        res(false, `Email already in use`, null),
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await this.hashService.hash(registerDto.password);

    const newUser = {
      email: registerDto.email,
      password: hashedPassword,
      name: registerDto.name,
      telephone: registerDto.telephone,
      role: registerDto.role,
    };

    const createUser = await this.userService.createUser(newUser);

    if (!createUser.data) {
      throw new BadRequestException(res(false, 'failed to create user', null));
    }

    return res(true, 'User successfully registered', newUser);
  }

  async login(loginDto: LoginDto): Promise<ObjectResponse<Tokens>> {
    const userFound = await this.userService.findUserByEmail(loginDto.email);

    if (!userFound.data) {
      throw new HttpException(
        res(false, `Email or password incorrect`, null),
        HttpStatus.BAD_REQUEST,
      );
    }

    const isPasswordValid = await this.hashService.compare(
      loginDto.password,
      userFound.data.password,
    );

    if (!isPasswordValid) {
      throw new HttpException(
        res(false, `email or Password incorrect`, null),
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = userFound.data;
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      telephone: user.telephone,
      role: user.role,
    };

    return res(
      true,
      'User successfully logged in',
      await this.tokenService.generateTokens(payload),
    );
  }

  async logout(token: string): Promise<ObjectResponse<null>> {
    if (this.tokenService.isTokenInvalidated(token)) {
      throw new UnauthorizedException('Token has been invalidated');
    }

    this.tokenService.invalidateToken(token);
    return res(true, 'User successfully logged out', null);
  }
}
