export interface OrderRequest {
  /** Nome del cliente */
  customer: string;

  /** Quantità dell’ordine */
  quantity: number;

  /** Unità di misura (es. "kg", "g", "pcs") */
  quantityUnit: string;

  /** Prezzo unitario */
  unitPrice: number;

  /** Prezzo totale */
  totalPrice: number;

  /** Data dell’ordine (ISO string) */
  orderDate: string;
}
