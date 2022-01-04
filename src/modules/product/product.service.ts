import { Injectable } from '@nestjs/common';

import { ProductRepository } from '../../repositories/product.repository';
import { CreateProductDto } from './dto/createProduct.dto';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
  ) {}

  async createProduct(createProductDto: CreateProductDto) {
    const createdProduct = await this.productRepository.createProduct(createProductDto);
    return createdProduct;
  }

  async findByName(name: string) {
    const product = await this.productRepository.findByName(name);
    return product;
  }

  async findById(id: string) {
    const product = await this.productRepository.findById(id);
    return product;
  }

  async findAndDelete(id: string) {
    return await this.productRepository.findAndDelete(id);
  }

  async findAll() {
    const products = this.productRepository.findAll();
    return products;
  }
}
