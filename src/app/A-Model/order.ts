export interface Order {
    id: number;

    customer: string; // nome del cliente, es. "Mario Rossi"

    quantity: number;   // es. 250
    quantityUnit: string; // es. "g", "kg", "pcs"

    // isPurchase: boolean; // true = acquisto, false = vendita

    unitPrice: number;   // prezzo per unità
    totalPrice: number;  // quantity * unitPrice

    orderDate: string;        // data ordine

    createdAt: string;
    modifiedAt: string;
}