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
import { CategoryService } from '../services/category.service';
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos';
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
import { AdminGuard } from 'src/auth/guards/admin.guard';

@ApiTags('Categories')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Success' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Server Error' })
  @ApiOperation({ summary: 'Create a category' })
  @Post('create')
  async createCategory(@Body() category: CreateCategoryDto) {
    return await this.categoryService.createCategory(category);
  }

  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Success' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Server Error' })
  @ApiOperation({ summary: 'Find all categories' })
  @Get('all')
  async findAllCategories(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return await this.categoryService.findAllCategories(page, limit);
  }

  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Success' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Server Error' })
  @ApiOperation({ summary: 'Find categories by name' })
  @Get('find/:name')
  async findCategoryByName(
    @Param('name') name: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return await this.categoryService.findCategoryByName(name, page, limit);
  }

  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Success' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Server Error' })
  @ApiOperation({ summary: 'Update category' })
  @Put('update/:id')
  async updateCategory(
    @Param('id') id: number,
    @Body() updateCategory: UpdateCategoryDto,
  ) {
    return await this.categoryService.updateCategory(id, updateCategory);
  }

  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Success' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Server Error' })
  @ApiOperation({ summary: 'Delete category' })
  @Delete('delete/:id')
  async deleteCategory(@Param('id') id: number) {
    return await this.categoryService.deleteCategory(id);
  }
}
