import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';

import { Product, ProductSchema } from '../../models/product.model';

import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductRepository } from '../../repositories/product.repository';


describe('ProductService', () => { 
    let service: ProductService;
    const productDTO = {
        name: 'Prueba',
        description: 'Prueba'
    }
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [
            MongooseModule.forRoot('mongodb://127.0.0.1:27017', {
                useNewUrlParser: true,
                dbName: 'products',
              }),
            MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
        ],
        controllers: [ProductController],
        providers: [ProductService, ProductRepository],
        exports: [ProductService, ProductRepository],
        
      }).compile();
  
      service = await module.get<ProductService>(ProductService);
    });

    it('should be defined', () => { 
        expect(service).toBeDefined();
    });

    it('should list products', async () => { 
        const productGets = await service.findAll();
        expect(productGets).toBeDefined();
    });

    it('should save product and delete product', async () =>{
        // Save product
        const productSave = await service.createProduct(productDTO);
        expect(productSave.name).toEqual(productDTO.name);
        expect(productSave.description).toEqual(productDTO.description);
        // Delete product
        const { id } = productSave;
        await service.findAndDelete(id);
        const productDeleted = await service.findById(id);
        expect(productDeleted).toEqual(null);
    })
    

});
  