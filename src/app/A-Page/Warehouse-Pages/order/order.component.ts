import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DatePickerModule } from 'primeng/datepicker';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumber } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { ToolbarModule } from 'primeng/toolbar';
import { TreeSelectModule } from 'primeng/treeselect';
import { ProductService } from '../../../A-Service/product.service';
import { Product } from '../../../A-Model/product';
import { Order } from '../../../A-Model/order';
import { OrderRequest } from '../../../A-Model/orderRequest';

@Component({
  selector: 'app-order',
  imports: [CommonModule, ButtonModule, ToastModule, FormsModule, InputNumber, DropdownModule,
    ReactiveFormsModule, ToolbarModule, InputTextModule, DatePickerModule, TreeSelectModule, ConfirmDialogModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss'
})
export class OrderComponent implements OnInit {

  idWarehouse: number = 0;
  idProduct: number = 0;
  idOrder: number = 0;

  isLargeScreen: boolean = false;
  isEditOrder: boolean = false;

  orderForm!: FormGroup;

  product: Product | undefined;
  totalQuantity: number | undefined;
  currency: string | undefined;

  order: Order | undefined;
  orderRequest: OrderRequest | undefined;

  constructor(private fb: FormBuilder,
          private router: Router,
          private route: ActivatedRoute,
          private messageService: MessageService,
          private confirmationService: ConfirmationService,
          private productService: ProductService) {}

  ngOnInit(): void {
    this.checkScreenSize();

    this.initForm();

    this.route.paramMap.subscribe(params => {
      this.idWarehouse = Number(params.get('idWarehouse'));
      this.idProduct = Number(params.get('idProduct'));
      this.idOrder = Number(params.get('idOrder'));

      this.loadProduct();

      if (this.idProduct > 0 && this.idWarehouse > 0 && this.idOrder > 0) {
        this.isEditOrder = true;
        this.loadOrder();
      }
      else 
        this.isEditOrder = false;

    });
  }

  loadProduct() {
    this.productService.getById(this.idWarehouse, this.idProduct).subscribe({
        next: (product) => {
          this.product = product;

          this.orderForm.get('quantityUnit')?.setValue(this.product.quantityUnit);
          this.totalQuantity = this.product.totalQuantity;
          this.currency = this.product.currency;
        },
        error: () => {
            this.messageService.add({ severity: 'error', summary: 'Errore caricamento prodotto', detail: 'Errore nel caricamento del prodotto' });
        }
    });
  }

  loadOrder() {
    this.productService.getOrderById(this.idWarehouse, this.idProduct, this.idOrder).subscribe({
        next: (order) => {
          this.order = order;

          this.patchValue(this.order);
        },
        error: () => {
            this.messageService.add({ severity: 'error', summary: 'Errore caricamento prodotto', detail: 'Errore nel caricamento del prodotto' });
        }
    });
  }

  onGoBack() {
    window.history.back();
  }

  onSaveOrder() {
    this.getFormValue();

    if (this.orderRequest &&
        this.isEditOrder && 
        this.idOrder > 0) {
      
      this.productService.updateOrder(this.idWarehouse, this.idProduct, this.idOrder, this.orderRequest).subscribe({
        next: (product) => {
          this.onGoBack();
          this.messageService.add({ severity: 'success', summary: 'Ordine aggiornato', detail: 'L\'ordine è stato aggiornato con successo.' });
        },
        error: () => {
            this.messageService.add({ severity: 'error', summary: 'Errore caricamento ordine', detail: 'Errore nel caricamento dell\'ordine.' });
        }
      });

    }
    else if (this.orderRequest) {
      console.log("this.idProduct", this.idProduct);
      this.productService.createOrder(this.idWarehouse, this.idProduct, this.orderRequest).subscribe({
        next: (product) => {
          this.onGoBack();
          this.messageService.add({ severity: 'success', summary: 'Ordine creato', detail: 'L\'ordine è stato creato con successo.' });
        },
        error: () => {
            this.messageService.add({ severity: 'error', summary: 'Errore caricamento prodotto', detail: 'Errore nel caricamento del prodotto' });
        }
      });

    }

  }

  onDeleteOrder() {

    // Logic to delete order
    this.confirmationService.confirm({
      message: 'Sicuro di voler eliminare questo ordine?',
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
        this.productService.delete(this.idWarehouse, this.idOrder).subscribe({
          next: () => { this.router.navigate(['/warehouse', this.idWarehouse, 'products']); this.messageService.add({ severity: 'success', summary: 'Eliminazione ordine', detail: 'ordine eliminato con successo!', life: 3000 }); },
          error: err => { this.messageService.add({ severity: 'error', summary: 'Eliminazione ordine', detail: 'Errore durante l\'eliminazione dell\'ordine. Errore:\n' + err, sticky: true }); },
        });
      },
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'Annullato', detail: 'Eliminazione prodotto annullata' });
      }
    });

  }

  private initForm() {
    this.orderForm = this.fb.group({
      customer: ['', Validators.required],
      quantity: [null, Validators.required],
      quantityUnit: [{ value: 'pcs', disabled: true }, Validators.required],
      unitPrice: [0, Validators.required],
      totalPrice: [{ value: null, disabled: true }, Validators.required],
      orderDate: [null, Validators.required],
      createdAt: [{ value: new Date(), disabled: true }],
      modifiedAt: [{ value: new Date(), disabled: true }],
    });

    this.orderForm.get('quantity')?.valueChanges.subscribe(() => {
      this.updateTotalPrice();
    });

    this.orderForm.get('unitPrice')?.valueChanges.subscribe(() => {
      this.updateTotalPrice();
    });

  }

  private patchValue(order: Order) {
    this.orderForm.patchValue({
      customer: order.customer,
      quantity: order.quantity,
      quantityUnit: order.quantityUnit,
      unitPrice: order.unitPrice,
      totalPrice: order.totalPrice,
      orderDate: new Date(order.orderDate),
      createdAt: new Date(order.createdAt),
      modifiedAt: new Date(order.modifiedAt)
    });
  }

  private getFormValue() {
    this.orderRequest = {
      customer: this.orderForm.getRawValue().customer,
      quantity: this.orderForm.getRawValue().quantity,
      quantityUnit: this.orderForm.getRawValue().quantityUnit,
      unitPrice: this.orderForm.getRawValue().unitPrice,
      totalPrice: this.orderForm.getRawValue().totalPrice,
      orderDate: this.orderForm.getRawValue().orderDate,
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    // Bootstrap imposta il breakpoint lg a 992px
    this.isLargeScreen = window.innerWidth >= 992;
  }

  private updateTotalPrice(): void {
    const quantity = this.orderForm.get('quantity')?.value ?? 0;
    const unitPrice = this.orderForm.get('unitPrice')?.value ?? 0;
    const total = quantity * unitPrice;

    this.orderForm.get('totalPrice')?.setValue(total, { emitEvent: false });
  }


}
