import { Component, HostListener, OnInit } from '@angular/core';

import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Warehouse } from '../../../A-Model/warehouse';
import { WarehouseService } from '../../../A-Service/warehouse.service';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-warehouse-manage',
  imports: [
    DialogModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    TextareaModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './warehouse-manage.component.html',
  styleUrl: './warehouse-manage.component.scss'
})
export class WarehouseManageComponent implements OnInit {

  displayDialog: boolean = false; 
  isEdit: boolean = false;
  isLargeScreen: boolean = false;;

  // Utilizziamo un oggetto parziale per gestire il form in fase di inserimento/modifica
  warehousesForm!: FormGroup;

  // Array temporaneo in cui vengono salvate le schede create
  warehouses: Warehouse[] = [];
  createdWarehouse: Warehouse | null = null;
  currentId: number | null = null;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private fb: FormBuilder,
              private messageService: MessageService,
              private confirmationService: ConfirmationService,
              private warehouseService: WarehouseService
  ) {}

  ngOnInit(): void {
    // Controlla la dimensione dello schermo all'inizializzazione
    this.checkScreenSize();

    this.initForm();
    // Inizialmente potresti voler pre-impostare alcuni valori
    this.loadWarehouses();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    // Bootstrap imposta il breakpoint lg a 992px
    this.isLargeScreen = window.innerWidth >= 992;
  }

  private initForm(): void {
    this.warehousesForm = this.fb.group({
      Name: ['', Validators.required],
      Description: ['', Validators.required],
      CreationDate: [{ value: '', disabled: true }],
      ModifiedDate: [{ value: '', disabled: true }]
    });
  }

  loadWarehouses(): void {
    this.warehouseService.getAll().subscribe({
      next: data => { this.warehouses = data; this.messageService.add({ severity: 'success', summary: 'Caricamento dati', detail: 'Dati caricati con successo!', life: 3000 }); },
      error: err => { this.messageService.add({ severity: 'error', summary: 'Caricamento dati', detail: 'Errore durante il caricamento dei dati. Errore:\n' + err, sticky: true });}
    });
  }

  showCreateDialog(): void {
    this.isEdit = false;
    this.currentId = null;
    this.warehousesForm.reset();
    this.warehousesForm.patchValue({ CreationDate: new Date().toISOString(), ModifiedDate: new Date().toISOString() });
    this.displayDialog = true;
  }

  editWarehouse(w: Warehouse): void {
    this.isEdit = true;
    this.currentId = w.id;
    this.warehousesForm.patchValue({
      Name: w.name,
      Description: w.description,
      CreationDate: w.creationDate,
      ModifiedDate: w.modifiedDate
    });
    this.displayDialog = true;
  }

  onSave(): void {
    // Ottiene i valori del form senza considerare lo stato di disabled
    const formValue = this.warehousesForm.getRawValue(); 
    
    if (this.isEdit && this.currentId !== null) {
      this.warehouseService.update(this.currentId, formValue).subscribe({
        next: () => { this.loadWarehouses(); this.messageService.add({ severity: 'success', summary: 'Aggiornamento magazzino', detail: 'Magazzino aggiornato con successo!', life: 3000 }); },
        error: err => { this.messageService.add({ severity: 'error', summary: 'Aggiornamento magazzino', detail: 'Errore durante l\'aggiornamento del magazzino. Errore:\n' + err, sticky: true }); },
        complete: () => this.displayDialog = false
      });
    } else {
      this.warehouseService.create(formValue).subscribe({
        next: () => { this.loadWarehouses(), this.messageService.add({ severity: 'success', summary: 'Creazione magazzino', detail: 'Magazzino creato con successo!', life: 3000 }); },
        error: err => { this.messageService.add({ severity: 'error', summary: 'Creazione magazzino', detail: 'Errore durante la creazione del magazzino. Errore:\n' + err, sticky: true }); },
        complete: () => this.displayDialog = false
      });
    }
  }

  deleteWarehouse(id: number, event: Event): void {

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Sei sicuro di voler eliminare questo magazzino? Questa azione non può essere annullata.',
      header: 'Elimina magazzino',
      icon: 'pi pi-exclamation-triangle',
      rejectLabel: 'Annulla',
      acceptButtonProps: {
          label: 'Elimina',
          icon: 'pi pi-ban',
          severity: 'danger',
      },
      rejectButtonProps: {
          label: 'Annulla',
          severity: 'secondary',
          icon: 'pi pi-arrow-left',
          outlined: true,
      },

      accept: () => {
        this.warehouseService.delete(id).subscribe({
          next: () => { this.loadWarehouses(), this.messageService.add({ severity: 'success', summary: 'Eliminazione magazzino', detail: 'Magazzino eliminato con successo!', life: 3000 }); },
          error: err => { this.messageService.add({ severity: 'error', summary: 'Eliminazione magazzino', detail: 'Errore durante l\'eliminazione del magazzino. Errore:\n' + err, sticky: true }); },
          complete: () => this.displayDialog = false
        });
      },
      reject: () => {
          this.messageService.add({ severity: 'info', summary: 'Annullato', detail: 'Operazione annullata' });
      },
    });

  }

  onGoToMagazzino(id: number): void {
    // Naviga alla path /warehouse/:id
    this.router.navigate(['/warehouse', id, 'products']);
  }
  
}
