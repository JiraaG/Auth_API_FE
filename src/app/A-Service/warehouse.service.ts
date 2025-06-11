import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Warehouse } from '../A-Model/warehouse';

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {

  private apiUrl = 'https://localhost:7009/api/Warehouses';

  constructor(private http: HttpClient) { }

  /** GET: tutti i magazzini */
  getAll(): Observable<Warehouse[]> {
    return this.http.get<Warehouse[]>(this.apiUrl);
  }

  /** GET: magazzino per ID */
  getById(id: number): Observable<Warehouse> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Warehouse>(url);
  }

  /** POST: crea un nuovo magazzino */
  create(warehouse: Partial<Warehouse>): Observable<Warehouse> {
    return this.http.post<Warehouse>(this.apiUrl, warehouse);
  }

  /** PUT: aggiorna un magazzino esistente */
  update(id: number, warehouse: Partial<Warehouse>): Observable<Warehouse> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<Warehouse>(url, warehouse);
  }

  /** DELETE: elimina un magazzino */
  delete(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }
}
