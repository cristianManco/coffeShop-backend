import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { AdminGuard } from 'src/auth/guards/admin.guard';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiCreatedResponse({ description: 'Success' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Server Error' })
  @ApiOperation({ summary: 'Create a user' })
  @Post('create')
  async createUser(@Body() user: CreateUserDto) {
    return this.userService.createUser(user);
  }

  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Success' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Server Error' })
  @ApiOperation({ summary: 'Find user by email' })
  @Get('find/email/:email')
  async findUserByEmail(@Param('email') email: string) {
    return this.userService.findUserByEmail(email);
  }

  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Success' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Server Error' })
  @ApiOperation({ summary: 'Find users by name' })
  @Get('find/name/:name')
  async findUsersByName(
    @Param('name') name: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.userService.findUsersByName(name, page, limit);
  }

  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Success' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Server Error' })
  @ApiOperation({ summary: 'Find all users' })
  @Get('all')
  async findAllUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.userService.findAllUsers(page, limit);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Success' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Server Error' })
  @ApiOperation({ summary: 'Update user' })
  @Put('update/:id')
  async updatedUser(@Param('id') id: number, @Body() user: UpdateUserDto) {
    return this.userService.updatedUser(id, user);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Success' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Server Error' })
  @ApiOperation({ summary: 'Delete user' })
  @Delete('delete/:id')
  async deleteUser(@Param('id') id: number) {
    return this.userService.deleteUser(id);
  }
}
