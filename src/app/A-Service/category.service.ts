import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../A-Model/category';
import { CategoryRequest } from '../A-Model/categoryRequest';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

   private readonly apiUrl = 'https://localhost:7009/api/categories';

  constructor(private http: HttpClient) {}

  /** GET /api/categories */
  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }

  /** GET /api/categories/:id */
  getById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`);
  }

  /** POST /api/categories */
  create(payload: CategoryRequest): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, payload);
  }

  /** PUT /api/categories/:id */
  update(id: number, payload: CategoryRequest): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${id}`, payload);
  }

  /** DELETE /api/categories/:id */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  
}
