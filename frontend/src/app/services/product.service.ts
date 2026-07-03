import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Product, ProductCount } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private productApiUrl = 'http://localhost:5027/products';

  constructor(private http: HttpClient) {}

  addProduct(productId: string): Observable<Product> {
    let pureProductId = productId.replaceAll('-', '');
    return this.http.post<Product>(
      `${this.productApiUrl}/${pureProductId}`,
      {}
    );
  }

  getProducts(pageNumber: number): Observable<Product[]> {
    return this.http.get<Product[]>(
      `${this.productApiUrl}/page/${pageNumber}`
    );
  }

  getTotal(): Observable<ProductCount> {
    return this.http.get<ProductCount>(
      `${this.productApiUrl}/count`
    );
  }

  removeProduct(productId: string): Observable<any> {
    return this.http.delete<any>(
      `${this.productApiUrl}/${productId}`
    );
  }
}
