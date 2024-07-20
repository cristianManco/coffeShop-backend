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
import { ProductService } from '../services/product.service';
import { CreateProductDto, UpdateProductDto } from '../dtos';
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

@ApiTags('Products')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Success' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Server Error' })
  @ApiOperation({ summary: 'Create a product' })
  @Post('create')
  async create(@Body() product: CreateProductDto) {
    return this.productService.create(product);
  }

  @ApiOkResponse({ description: 'Success' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Server Error' })
  @ApiOperation({ summary: 'Find all products' })
  @Get('all')
  async findAll(@Query('page') page: number, @Query('limit') limit: number) {
    return this.productService.findAll(page, limit);
  }

  @ApiOkResponse({ description: 'Success' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Server Error' })
  @ApiOperation({ summary: 'Find product by id' })
  @Get(':id')
  async getProductById(@Param('id') id: number) {
    return this.productService.getProductById(id);
  }

  @ApiOkResponse({ description: 'Success' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Server Error' })
  @ApiOperation({ summary: 'Find products by name' })
  @Get('find/:name')
  async findProductsByName(
    @Param('name') name: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.productService.findProductsByName(name, page, limit);
  }

  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Success' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Server Error' })
  @ApiOperation({ summary: 'Update product' })
  @Put('update/:id')
  async update(@Param('id') id: number, @Body() product: UpdateProductDto) {
    return this.productService.updateProduct(id, product);
  }

  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Success' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Server Error' })
  @ApiOperation({ summary: 'Delete product' })
  @Delete('delete/:id')
  async delete(@Param('id') id: number) {
    return this.productService.deleteProduct(id);
  }
}
