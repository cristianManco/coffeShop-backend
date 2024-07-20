import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { Tokens } from '../types/toke.type';
import { LoginDto } from '../dtos/login-user.dto';
import { RegisterDto } from '../dtos/register-user.dto';
import { User } from 'src/modules/users/entities/user.entity';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { ObjectResponse } from 'src/libs/utils/interfaces/object-response.interface';

@ApiTags('authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'User login' })
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<ObjectResponse<Tokens>> {
    return this.authService.login(loginDto);
  }

  @ApiOperation({ summary: 'User registration' })
  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<ObjectResponse<User>> {
    return this.authService.register(registerDto);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'User logout' })
  @Post('logout')
  async logout(@Req() req): Promise<ObjectResponse<null>> {
    const token = req.headers.authorization.split(' ')[1];
    return this.authService.logout(token);
  }
}
