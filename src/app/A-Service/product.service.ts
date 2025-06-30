import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../A-Model/product';
import { Order } from '../A-Model/order';
import { ProductRequest } from '../A-Model/productRequest';
import { OrderRequest } from '../A-Model/orderRequest';

@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(private http: HttpClient) {}

  private readonly apiRoot = 'https://localhost:7009/api/warehouses';

  // --- PRODUCTS CRUD ---

  private productsUrl(warehouseId: number): string {
    return `${this.apiRoot}/${warehouseId}/products`;
  }

  private productUrl(warehouseId: number): string {
    return `${this.apiRoot}/${warehouseId}/product`;
  }

  /** GET /api/warehouses/:warehouseId/products */
  getAll(warehouseId: number): Observable<Product[]> {
    return this.http.get<Product[]>(this.productsUrl(warehouseId));
  }

  /** GET /api/warehouses/:warehouseId/products/:id */
  getById(warehouseId: number, id: number): Observable<Product> {
    return this.http.get<Product>(this.productUrl(warehouseId) + `/${id}`);
  }

  /** POST /api/warehouses/:warehouseId/products */
  create(
    warehouseId: number,
    payload: ProductRequest
  ): Observable<Product> {
    return this.http.post<Product>(
      this.productUrl(warehouseId),
      payload
    );
  }

  /** PUT /api/warehouses/:warehouseId/products/:id */
  update(
    warehouseId: number,
    id: number,
    payload: ProductRequest
  ): Observable<Product> {
    return this.http.put<Product>(
      this.productUrl(warehouseId) + `/${id}`,
      payload
    );
  }

  /** DELETE /api/warehouses/:warehouseId/products/:id */
  delete(
    warehouseId: number,
    id: number
  ): Observable<void> {
    return this.http.delete<void>(
      this.productUrl(warehouseId) + `/${id}`
    );
  }

  // --- ORDERS CRUD (nested) ---

  private ordersUrl(
    warehouseId: number,
    productId: number
  ): string {
    console.log("ordersUrl - productId", productId);
    return `${this.productUrl(warehouseId)}/${productId}/order`;
  }

  /** GET /api/warehouses/:warehouseId/products/:productId/orders */
  // getOrders(
  //   warehouseId: number,
  //   productId: number
  // ): Observable<Order[]> {
  //   return this.http.get<Order[]>(
  //     this.ordersUrl(warehouseId, productId)
  //   );
  // }

  /** GET /api/warehouses/:warehouseId/products/:productId/order/:id */
  // getOrderById(
  //   warehouseId: number,
  //   productId: number,
  //   id: number
  // ): Observable<Order> {
  //   return this.http.get<Order>(
  //     `${this.ordersUrl(warehouseId, productId)}/${id}`
  //   );
  // }

  /** Get by id /api/warehouses/:warehouseId/product/:productId/order/:orderId */
  getOrderById(
    warehouseId: number,
    productId: number,
    orderId: number
  ): Observable<Order> {
    return this.http.get<Order>(
      `${this.productUrl(warehouseId)}/${productId}/order/${orderId}`
    );
  }

  /** POST /api/warehouses/:warehouseId/product/:productId/order */
  createOrder(
    warehouseId: number,
    productId: number,
    payload: OrderRequest
  ): Observable<Order> {
    return this.http.post<Order>(
      this.ordersUrl(warehouseId, productId),
      payload
    );
  }

  /** PUT /api/warehouses/:warehouseId/product/:productId/order/:id */
  updateOrder(
    warehouseId: number,
    productId: number,
    id: number,
    payload: OrderRequest
  ): Observable<Order> {
    return this.http.put<Order>(
      `${this.ordersUrl(warehouseId, productId)}/${id}`,
      payload
    );
  }

  /** DELETE /api/warehouses/:warehouseId/product/:productId/order/:id */
  deleteOrder(
    warehouseId: number,
    productId: number,
    id: number
  ): Observable<void> {
    return this.http.delete<void>(
      `${this.ordersUrl(warehouseId, productId)}/${id}`
    );
  }
  
}