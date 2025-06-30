import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../A-Service/product.service';
import { Product } from '../../../A-Model/product';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { Order } from '../../../A-Model/order';
import { OrderRequest } from '../../../A-Model/orderRequest';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { DialogModule } from 'primeng/dialog';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { FloatLabelModule } from 'primeng/floatlabel';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-products',
  imports: [
    TableModule, 
    ButtonModule, 
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule, 
    ToolbarModule, 
    InputTextModule, 
    CheckboxModule,
    DatePickerModule,
    InputNumberModule,
    ConfirmDialogModule,
    ToastModule,
    IconField, 
    InputIcon,
    DialogModule,
    ToggleSwitchModule,
    FloatLabelModule,
    RippleModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
  idWarehouse: number = 0;

  products: Product[] = [];
  originalProducts: Product[] = [];
  selectedProducts: Product[] = [];

  clonedProducts: { [id: number]: Product } = {};
  clonedOrder: { [id: number]: Order } = {};

  orderReq!: OrderRequest;
  order!: Order;

  isEditProduct: boolean = false;
  isEditOrder: boolean = false;

  idProduct: number = 0;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private fb: FormBuilder,
              private messageService: MessageService,
              private confirmationService: ConfirmationService,
              private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.idWarehouse = Number(this.route.snapshot.paramMap.get('idWarehouse'));
    this.loadProducts();
  }

  loadProducts(): void {
    if (this.idWarehouse !== undefined) {
      this.productService.getAll(this.idWarehouse).subscribe({
        next: (data) => {
          this.products = data;
          this.originalProducts = this.products;
          this.messageService.add({ severity: 'success', summary: 'Caricamento dati', detail: 'Prodotti caricati con successo!', life: 2000 });
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Caricamento dati', detail: 'Errore durante il caricamento dei prodotti', sticky: true });
        }
      });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Caricamento dati', detail: 'Nessun magazzino trovato per i prodotti', sticky: true });
    }
  }

  onExportExcel() {
    import('xlsx').then(xlsx => {
      try {
        if (!this.products || this.products.length === 0) {
          this.messageService.add({ severity: 'warn', summary: 'Download dati', detail: 'Nessun prodotto da esportare.', life: 2000 });
          return;
        }
        const worksheet = xlsx.utils.json_to_sheet(this.products);
        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Prodotti');
        xlsx.writeFile(workbook, 'Prodotti.xlsx');
        this.messageService.add({ severity: 'success', summary: 'Download dati', detail: 'Prodotti scaricati con successo in formato xlsx!', life: 2000 });
      } catch (error) {
        this.messageService.add({ severity: 'error', summary: 'Download dati', detail: 'Errore durante l\'esportazione dei prodotti.', sticky: true });
      }
    }).catch(() => {
      this.messageService.add({ severity: 'error', summary: 'Download dati', detail: 'Impossibile caricare la libreria di esportazione.', sticky: true });
    });
  }
  
  onDeleteProduct(id: number, event: Event): void { 
    
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Sei sicuro di voler eliminare questo prodotto? Tutti gli ordini associati saranno eliminati di conseguenza.',
      header: 'Elimina prodotto',
      icon: 'pi pi-exclamation-triangle',
      rejectLabel: 'Annulla',
      acceptButtonProps: {
          label: 'Elimina',
          icon: 'pi pi-trash',
          severity: 'danger',
      },
      rejectButtonProps: {
          label: 'Annulla',
          severity: 'secondary',
          icon: 'pi pi-arrow-left',
          outlined: true,
      },

      accept: () => {
        this.productService.delete(this.idWarehouse, id).subscribe({
          next: () => { this.loadProducts(), this.messageService.add({ severity: 'success', summary: 'Eliminazione prodotto', detail: 'Prodotto eliminato con successo!', life: 3000 }); },
          error: err => { this.messageService.add({ severity: 'error', summary: 'Eliminazione prodotto', detail: 'Errore durante l\'eliminazione del prodotto. Errore:\n' + err, sticky: true }); },
        });
      },
      reject: () => {
          this.messageService.add({ severity: 'info', summary: 'Annullato', detail: 'Operazione annullata' });
      },
    });

  }

  onDeleteOrder(id: number, idProduct: number, event: Event): void { 
    
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Sei sicuro di voler eliminare questo ordine?',
      header: 'Elimina ordine',
      icon: 'pi pi-exclamation-triangle',
      rejectLabel: 'Annulla',
      acceptButtonProps: {
          label: 'Elimina',
          icon: 'pi pi-trash',
          severity: 'danger',
      },
      rejectButtonProps: {
          label: 'Annulla',
          severity: 'secondary',
          icon: 'pi pi-arrow-left',
          outlined: true,
      },

      accept: () => {
        this.productService.deleteOrder(this.idWarehouse, idProduct, id).subscribe({
          next: () => { this.loadProducts(), this.messageService.add({ severity: 'success', summary: 'Eliminazione ordine', detail: 'Ordine eliminato con successo!', life: 3000 }); },
          error: err => { this.messageService.add({ severity: 'error', summary: 'Eliminazione ordine', detail: 'Errore durante l\'eliminazione dell\'ordine. Errore:\n' + err, sticky: true }); },
        });
      },
      reject: () => {
          this.messageService.add({ severity: 'info', summary: 'Annullato', detail: 'Operazione annullata' });
      },
    });

  }

  goBehind(): void {
    this.router.navigate(['/warehouse'], { relativeTo: this.route });
  }

  goToCategory(): void {
    // Naviga alla pagina delle categorie del magazzino corrente
    this.router.navigate(['../categories'], { relativeTo: this.route });
  }

  goToProduct(idProduct: number): void {
    // Naviga alla pagina del prodotto specifico
    this.router.navigate(['../product', idProduct], { relativeTo: this.route });
  }

  goToOrder(idProduct: number, idOrder: number): void {
    // Naviga alla pagina degli ordini del prodotto specifico
    this.router.navigate([
      '/warehouse',
      this.idWarehouse,
      'products',
      idProduct,
      'order',
      idOrder
    ]);
  }

  getRowClass(product: Product): string {
    return product.isSold ? 'row-sold' : '';
  }

  onSearch(event: Event) {
    const searchValue = (event.target as HTMLInputElement).value.toLowerCase();
    if (!searchValue) {
      this.products = [...this.originalProducts];
      return;
    }

    this.products = this.originalProducts.filter(product => {
      // Cerca nei campi del prodotto
      const productMatch = Object.values(product).some(value =>
        value !== null &&
        value !== undefined &&
        value.toString().toLowerCase().includes(searchValue)
      );

      // Cerca negli ordini associati, se presenti
      let orderMatch = false;
      if (Array.isArray((product as any).orders)) {
        orderMatch = (product as any).orders.some((order: any) =>
          Object.values(order).some((orderValue: any) =>
            orderValue !== null &&
            orderValue !== undefined &&
            orderValue.toString().toLowerCase().includes(searchValue)
          )
        );
      }

      return productMatch || orderMatch;
    });
  }
  
}
