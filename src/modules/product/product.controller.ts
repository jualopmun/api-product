import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  Logger,
  UseGuards,
  Req,
  Get,
  Delete,
  Put,
} from '@nestjs/common';

import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

import { CreateProductDto } from './dto/createProduct.dto';
import { ProductService } from './product.service';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  private readonly logger = new Logger(ProductController.name);

  constructor(private productService: ProductService) {}

  @ApiOperation({
    summary: 'Get all products',
    description: 'Get all products',
  })
  @Get('/')
  async getAllProducts(@Res() res: any) {
    this.logger.log(`Init get all products`);
    let products: any;
    try {
      products = await this.productService.findAll();
      if (products.length === 0) {
        return res.status(HttpStatus.OK).send({ message: 'Products empty' });
      }
      return res.status(HttpStatus.OK).send(products);
    } catch (error) {
      this.logger.error(`Error get product: ${error}`);
      return res.status(HttpStatus.BAD_GATEWAY).send(error);
    }
  }

  @ApiOperation({
    summary: 'Get product by name',
    description: 'Get product by name',
  })
  @ApiParam({
    name: 'name',
    type: 'string',
    description: 'The name of product',
    required: true,
  })
  @Get('/:name')
  async getProduct(@Res() res: any, @Req() req: any) {
    const { name } = req.params;
    this.logger.log(`Init get product with name : ${name}`);
    let products: any;
    try {
      products = await this.productService.findByName(name);
      if (products.length === 0) {
        return res.status(HttpStatus.OK).send({ message: 'Products not found' });
      }
      this.logger.log(`Products get: ${products}`);
      return res.status(HttpStatus.OK).send(products);
    } catch (error) {
      this.logger.error(`Error get product: ${error}`);
      return res.status(HttpStatus.BAD_GATEWAY).send(error);
    }
  }

  @ApiOperation({
    summary: 'Create product',
    description: 'Create product',
  })
  @Post('/createProduct')
  @UseGuards(AuthGuard('jwt'))
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @Res() res: any,
  ) {
    this.logger.log(`Init create product with name : ${createProductDto.name}`);
    let newProduct: any;
    try {
      newProduct = await this.productService.createProduct(createProductDto);
      this.logger.log(`product created: ${newProduct}`);
      return res.status(HttpStatus.CREATED).send(newProduct);
    } catch (error) {
      this.logger.error(`Error in create product: ${error}`);
      return res.status(HttpStatus.BAD_GATEWAY).send(error);
    }
  }

  @ApiOperation({
    summary: 'Delete product',
    description: 'Delete product',
  })
  @Delete('/deleteProduct/:idProduct')
  @UseGuards(AuthGuard('jwt'))
  async deleteProduct(@Res() res: any, @Req() req: any) {
    let product: any;
    const { idProduct } = req.params;
    try {
      product = await this.productService.findById(idProduct);
      if (!product) {
        return res.status(HttpStatus.OK).send({ message: 'Product not found' });
      }
      await this.productService.findAndDelete(idProduct);
      this.logger.log(`Product delete: ${product.id}`);
      return res
        .status(HttpStatus.OK)
        .send({ message: 'Product deleted correctly' });
    } catch (error) {
      this.logger.error(`Error in create product: ${error}`);
      return res.status(HttpStatus.BAD_GATEWAY).send(error);
    }
  }
}
