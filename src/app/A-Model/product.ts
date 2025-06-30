import { Order } from "./order";

export interface Product {
    id: number;
    code: string;
    name: string;
    description: string;

    quantity: number; // quantità disponibile nel magazzino
    quantityUnit: string; // es. "g", "kg", "pcs"
    totalQuantity: number;

    purchasePrice: number;
    purchaseDate: Date;

    isSold: boolean;   // vero = già venduto

    saleOrdersPrice: number;

    currency: string;  // es. "EUR", "USD"

    createdAt: Date;
    modifiedAt: Date;

    categoryId: number;
    categoryName: string; // nome della categoria, opzionale

    // relazione bidirezionale: tutti gli ordini associati
    orders?: Order[];
}