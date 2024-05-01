import { subDays, subHours } from 'date-fns';
import type { ProductModel } from '../types/product-model';

const now = new Date();

class ProductsApi {
  getProducts(): Promise<ProductModel[]> {
    const products: ProductModel[] = [];

    return Promise.resolve(products);
  }
}

export const productApi = new ProductsApi();
