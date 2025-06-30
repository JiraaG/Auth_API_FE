import { CommonModule } from '@angular/common';
import { Component, HostListener, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabel } from 'primeng/floatlabel';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { DatePickerModule } from 'primeng/datepicker';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../../A-Service/category.service';
import { Category } from '../../../A-Model/category';
import { TreeSelectModule } from 'primeng/treeselect';
import { ConfirmationService, MessageService, TreeNode } from 'primeng/api';
import { Product } from '../../../A-Model/product';
import { ProductService } from '../../../A-Service/product.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputNumber } from 'primeng/inputnumber';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { DropdownModule } from 'primeng/dropdown';
import { ProductRequest } from '../../../A-Model/productRequest';

@Component({
  selector: 'app-product',
  imports: [CommonModule, ButtonModule, ToastModule, FormsModule, InputNumber, ToggleSwitch, DropdownModule,
    ReactiveFormsModule, ToolbarModule, InputTextModule, DatePickerModule, TreeSelectModule, ConfirmDialogModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent implements OnInit {

  idWarehouse: number = 0;
  idProduct: number = 0;
  isEditProduct: boolean = false;
  
  productForm!: FormGroup;

  categoryList: Category[] = []; // Replace with actual type if available
  categoryTree: TreeNode[] = []; // Tree structure for categories

  product: Product | undefined; // Replace with actual product type if available
  
  isLargeScreen: boolean = false;

  totalQuantityBackup: number | undefined;
  quantityBackup: number | undefined;
  residue: number | undefined;
  haveOrder: boolean = false;

  units = [
    // unità pezzo/confezione
    { label: 'Pezzi',         value: 'pcs'      },
    { label: 'Unità',         value: 'unit'     },
    { label: 'Coppia',        value: 'pair'     },
    { label: 'Dozzina',       value: 'doz'      },
    { label: 'Confezione',    value: 'pack'     },
    { label: 'Scatola',       value: 'box'      },
    { label: 'Rotolo',        value: 'roll'     },
    { label: 'Set',           value: 'set'      },

    // massa
    { label: 'Milligrammo',   value: 'mg'       },
    { label: 'Grammo',        value: 'g'        },
    { label: 'Chilogrammo',   value: 'kg'       },
    { label: 'Tonnellata',    value: 't'        },
    { label: 'Libbra',        value: 'lb'       },
    { label: 'Oncia',         value: 'oz'       },

    // volume
    { label: 'Millilitro',    value: 'ml'       },
    { label: 'Centilitro',    value: 'cl'       },
    { label: 'Decilitro',     value: 'dl'       },
    { label: 'Litro',         value: 'l'        },
    { label: 'Metro cubo',    value: 'm³'       },
    { label: 'Gallone (US)',  value: 'gal_us'   },
    { label: 'Gallone (UK)',  value: 'gal_uk'   },

    // lunghezza
    { label: 'Millimetro',    value: 'mm'       },
    { label: 'Centimetro',    value: 'cm'       },
    { label: 'Metro',         value: 'm'        },
    { label: 'Chilometro',    value: 'km'       },
    { label: 'Pollice',       value: 'in'       },
    { label: 'Piede',         value: 'ft'       },
    { label: 'Yarda',         value: 'yd'       },

    // area
    { label: 'Metro quadrato', value: 'm²'      },
    { label: 'Ettaro',         value: 'ha'      },
    { label: 'Acro',           value: 'ac'      },

    // tempo (se ti serve)
    { label: 'Secondo',        value: 's'       },
    { label: 'Minuto',         value: 'min'     },
    { label: 'Ora',            value: 'h'       },
    { label: 'Giorno',         value: 'd'       },

    // energia (opzionali)
    { label: 'Wattora',        value: 'Wh'      },
    { label: 'Kilowattora',    value: 'kWh'     }
  ];

  currencyValues = [
    { value: 'USD', label: '$ - Dollaro Statunitense' },
    { value: 'EUR', label: '€ - Euro' },
    { value: 'JPY', label: '¥ - Yen Giapponese' },
    { value: 'GBP', label: '£ - Sterlina Britannica' },
    { value: 'AUD', label: 'A$ - Dollaro Australiano' },
    { value: 'CAD', label: 'C$ - Dollaro Canadese' },
    { value: 'CHF', label: 'CHF - Franco Svizzero' },
    { value: 'CNY', label: '¥ - Yuan Cinese' },
    { value: 'HKD', label: 'Dollaro di Hong Kong', symbol: 'HK$' },
    { value: 'NZD', label: 'Dollaro Neozelandese', symbol: 'NZ$' },
    { value: 'SEK', label: 'Corona Svedese', symbol: 'kr' },
    { value: 'KRW', label: 'Won Sudcoreano', symbol: '₩' },
    { value: 'SGD', label: 'Dollaro di Singapore', symbol: 'S$' },
    { value: 'NOK', label: 'Corona Norvegese', symbol: 'kr' },
    { value: 'INR', label: 'Rupia Indiana', symbol: '₹' },
    { value: 'BRL', label: 'Real Brasiliano', symbol: 'R$' },
    { value: 'MXN', label: 'Peso Messicano', symbol: '$' },
    { value: 'ZAR', label: 'Rand Sudafricano', symbol: 'R' },
    { value: 'TRY', label: 'Lira Turca', symbol: '₺' },
    { value: 'RUB', label: 'Rublo Russo', symbol: '₽' }
  ]

  constructor(
            private fb: FormBuilder,
            private categoryService: CategoryService,
            private productService: ProductService,
            private router: Router,
            private route: ActivatedRoute,
            private confirmationService: ConfirmationService,
            private messageService: MessageService
    ) {}

  ngOnInit(): void {
    
    this.checkScreenSize();

    this.initForm();
    this.loadCategories();

    // Initialize component
    this.route.paramMap.subscribe(params => {
      this.idWarehouse = Number(params.get('idWarehouse'));
      this.idProduct = Number(params.get('idProduct'));

      if (this.idProduct > 0 && this.idWarehouse > 0) {
        this.isEditProduct = true;

        this.loadProduct();
      }
      else 
        this.isEditProduct = false;
    });

  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    // Bootstrap imposta il breakpoint lg a 992px
    this.isLargeScreen = window.innerWidth >= 992;
  }

  private buildTree(nodes: Category[]): TreeNode[] {
    const buildChildren = (parentId: number | null): TreeNode[] => {
      return nodes
        .filter(n => n.parentCategoryId === parentId)
        .map(n => ({
          key: n.id.toString(),
          label: n.name,
          data: n,
          expanded: true,
          children: buildChildren(n.id)
        }));
    };

    // Avvia solo dai nodi radice (parentCategoryId === null)
    return buildChildren(null);
  }

  loadProduct(): void {
    // Logic to load product by idProduct and idWarehouse
    this.productService.getById(this.idWarehouse, this.idProduct).subscribe({
      next: (product) => {
        this.product = product;
        
        this.productForm.patchValue({
          code: this.product?.code || '',
          name: this.product?.name || '',
          description: this.product?.description || '',
          purchasePrice: this.product?.purchasePrice || 0,
          purchaseDate: new Date(this.product?.purchaseDate) || null,
          isSold: this.product?.isSold || false,
          currency: this.product?.currency || 'EUR',
          saleOrdersPrice: this.product?.saleOrdersPrice || 0,
          createdAt: new Date(this.product?.createdAt) || '',
          modifiedAt: new Date(),
          // categoryId: this.product?.categoryId?.toString() || null,
          quantity: this.product?.quantity || 0,
          quantityUnit: this.product?.quantityUnit || 'pcs',
          totalQuantity: this.product?.totalQuantity || 0,
        });
        this.totalQuantityBackup = this.product.totalQuantity;
        this.quantityBackup = this.product.quantity;
        this.residue = this.quantityBackup - this.totalQuantityBackup;
        if (this.product.orders !== null || this.product.orders > 0) 
          this.haveOrder = true
        else 
          this.haveOrder = false;

        const keyToSelect = this.product?.categoryId?.toString();
        const nodeToSelect = this.findTreeNodeByKey(this.categoryTree, keyToSelect);
        this.productForm.get('categoryId')?.setValue(nodeToSelect);

        this.messageService.add({ severity: 'success', summary: 'Prodotto caricato', detail: 'Il prodotto è stato caricato con successo.' });
      }
    });
  }

  onSaveProduct(): void {
    // Logic to save product
    if (this.isEditProduct && this.idProduct > 0) {

      const updatedProduct: ProductRequest = {
        code: this.productForm.getRawValue().code,
        name: this.productForm.getRawValue().name,
        description: this.productForm.getRawValue().description,
        quantity: this.productForm.getRawValue().quantity,
        quantityUnit: this.productForm.getRawValue().quantityUnit,
        totalQuantity: this.productForm.getRawValue().totalQuantity,
        purchasePrice: this.productForm.getRawValue().purchasePrice,
        purchaseDate: this.productForm.getRawValue().purchaseDate,
        isSold: this.productForm.getRawValue().isSold,
        saleOrdersPrice: this.productForm.getRawValue().saleOrdersPrice,
        currency: this.productForm.getRawValue().currency,
        createdAt: this.productForm.getRawValue().createdAt,
        modifiedAt: new Date(),
        categoryId: Number(this.productForm.getRawValue().categoryId.key)
      };

      this.productService.update(this.idWarehouse, this.idProduct, updatedProduct).subscribe({
        next: (product) => {
          console.log("product", product);
          this.router.navigate(['/warehouse', this.idWarehouse, 'products']);
          this.messageService.add({ severity: 'success', summary: 'Prodotto aggiornato', detail: 'Il prodotto è stato aggiornato con successo.' });
        },
        error: err => { this.messageService.add({ severity: 'error', summary: 'Aggiornamento prodotto', detail: 'Errore durante la modifica del prodotto. Errore:\n' + err, sticky: true }); }
      });
    }
    else {

      const newProduct: ProductRequest = {
        code: this.productForm.getRawValue().code,
        name: this.productForm.getRawValue().name,
        description: this.productForm.getRawValue().description,
        quantity: this.productForm.getRawValue().quantity,
        quantityUnit: this.productForm.getRawValue().quantityUnit,
        totalQuantity: this.productForm.getRawValue().quantity, // in fase di creazione imposto uguale alla quantita
        purchasePrice: this.productForm.getRawValue().purchasePrice,
        purchaseDate: this.productForm.getRawValue().purchaseDate,
        isSold: this.productForm.getRawValue().isSold,
        saleOrdersPrice: this.productForm.getRawValue().saleOrdersPrice,
        currency: this.productForm.getRawValue().currency,
        createdAt: this.productForm.getRawValue().createdAt,
        modifiedAt: new Date(),
        categoryId: Number(this.productForm.getRawValue().categoryId.key)
      };
      
      this.productService.create(this.idWarehouse, newProduct).subscribe({
        next: (product) => {
          this.router.navigate(['/warehouse', this.idWarehouse, 'products']);
          this.messageService.add({ severity: 'success', summary: 'Prodotto creato', detail: 'Il prodotto è stato creato con successo.' });
        },
        error: err => { this.messageService.add({ severity: 'error', summary: 'Creazione prodotto', detail: 'Errore durante la creazione del prodotto. Errore:\n' + err, sticky: true }); }
      });
    }

  }

  onDeleteProduct(event: Event): void {
    // Logic to delete product
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Sei sicuro di voler eliminare questo prodotto?',
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
        this.productService.delete(this.idWarehouse, this.idProduct).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Eliminato', detail: 'Prodotto eliminato con successo' });
            this.router.navigate(['/warehouse', this.idWarehouse, 'products']);
          }
        });
      },
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'Annullato', detail: 'Eliminazione prodotto annullata' });
      }
    });

  }

  onGoBack(): void {
    // Navigate back to the products list
    this.router.navigate(['/warehouse', this.idWarehouse, 'products']);
  }

  private loadCategories(): void {
    // Logic to load categories from the service
    this.categoryService.getAll().subscribe({
      next: (categories) => {
        this.categoryList = categories;
        
        // ricostruisco l’albero radice→figlie
        this.categoryTree = this.buildTree(this.categoryList);
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Errore', detail: 'Errore durante il caricamento delle categorie' });
      }
    });
  }

  private findTreeNodeByKey(nodes: TreeNode[], key: string): TreeNode | null {
    for (const node of nodes) {
      if (node.key === key) {
        return node;
      }
      const found = this.findTreeNodeByKey(node.children || [], key);
      if (found) return found;
    }
    return null;
  }


  private initForm(): void {
    this.productForm = this.fb.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required],
      purchasePrice: [0, Validators.required],
      purchaseDate: [null, Validators.required],
      isSold: [{ value: false }, Validators.required],
      currency: ['', Validators.required],
      saleOrdersPrice: [{ value: 0, disabled: true }, Validators.required],
      createdAt: [{ value: new Date(), disabled: true }],
      modifiedAt: [{ value: new Date(), disabled: true }],
      quantity: [null, Validators.required],
      quantityUnit: ['pcs', Validators.required],
      totalQuantity: [{ value: null, disabled: true }, Validators.required],
      categoryId: [null as string | null, Validators.required],
    });

    // Sincronizza quantità -> quantità totale in inserimento
    this.productForm.get('quantity')?.valueChanges.subscribe(val => {
      if (!this.isEditProduct) {
        this.productForm.get('totalQuantity')?.setValue(val, { emitEvent: false });
      }
      else if (this.totalQuantityBackup) {
        this.productForm.get('totalQuantity')?.setValue(val, { emitEvent: false });
      }
    });
  }

}
