import { InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Product } from '../models/product.model';
import { CreateProductDto } from '../modules/product/dto/createProduct.dto';

export class ProductRepository {
  private readonly logger = new Logger(ProductRepository.name);
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}

  async createProduct(createProductDto: CreateProductDto) {
    const newProduct = new this.productModel({
     ...createProductDto
    });

    try {
      const createdProduct = await newProduct.save();
      return createdProduct;
    } catch (error) {
      this.logger.error(`Error create Product repository: ${error}`);
      throw new InternalServerErrorException(error);
    }
  }

  async findById(id: string) {
    try {
      return await this.productModel.findById(id);
    } catch (error) {
      this.logger.error(`Error search Product by id repository: ${error}`);
      throw new InternalServerErrorException(error);
    }
  }

  async findByName(name: string) {
    try {
      return await this.productModel
        .find({
          name: { $regex: '.*' + name + '.*' },
        })
        .limit(5)
        .exec();
    } catch (error) {
      this.logger.error(`Error search Product by name repository: ${error}`);
      throw new InternalServerErrorException(error);
    }
  }

  async findAndDelete(id: string) {
    try {
      return await this.productModel.findByIdAndDelete(id);
    } catch (error) {
      this.logger.error(`Error deleted Product repository: ${error}`);
      throw new InternalServerErrorException(error);
    }
  }

  async findAll() {
    try {
      return await this.productModel.find()
    } catch (error) {
      this.logger.error(`Error find all Products: ${error}`);
      throw new InternalServerErrorException(error);
    }
  }
}
