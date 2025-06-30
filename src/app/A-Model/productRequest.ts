export interface ProductRequest {
  /** Codice univoco (SKU, Barcode, ecc.) */
  code?: string;

  /** Nome prodotto */
  name: string;

  /** Descrizione prodotto */
  description: string;

  quantity: number; // quantità disponibile nel magazzino
  quantityUnit: string; // es. "g", "kg", "pcs"
  totalQuantity: number;

  /** Prezzo di acquisto */
  purchasePrice: number;

  /** Data di acquisto (ISO string) */
  purchaseDate: Date;

  /** Se il prodotto è stato effettivamente venduto */
  isSold: boolean;

  /** Prezzo di vendita (significativo solo se isSold === true) */
  saleOrdersPrice: number;

  /** Valuta ISO (es. "EUR", "USD") */
  currency: string;

  /** Data di creazione record (ISO string) */
  createdAt: Date;

  /** Data di ultima modifica record (ISO string) */
  modifiedAt: Date;

  /** ID della categoria */
  categoryId: number;
}
