import { CommonModule } from '@angular/common';
import { Component, computed, OnInit, signal, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { Table, TableModule } from 'primeng/table';
import { CategoryService } from '../../../A-Service/category.service';
import { Category } from '../../../A-Model/category';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CategoryRequest } from '../../../A-Model/categoryRequest';
import { ToolbarModule } from 'primeng/toolbar';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-categories',
  imports: [CommonModule, TableModule, ButtonModule, DialogModule, ToastModule, FormsModule,
    ReactiveFormsModule, ToolbarModule, IconField, InputIcon, InputTextModule, ConfirmDialogModule ],
  providers: [DialogService, MessageService, ConfirmationService],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit {

  idWarehouse: number | null = null;

  allCategories: Category[] = [];
  allCategoriesCopy: Category[] = [];
  parentCategories: Category[] = [];
  childCategories: Category[] = [];

  categoryRequest: CategoryRequest = {
    name: '',
    description: '',
    parentCategoryId: undefined
  };

  selectedParent: Category | null = null;

  clonedCategories: { [key: number]: Category } = {};

  parentCategoryForm!: FormGroup;
  childCategoryForm!: FormGroup;

  displayParentCategoryDialog: boolean = false;
  displayChildCategoryDialog: boolean = false;

  // campo di ricerca
  searchQuery = signal('');
  
  isEditMode: boolean = false;

  constructor(private messageService: MessageService,
            private fb: FormBuilder,
            private categoryService: CategoryService,
            private route: ActivatedRoute,
            private confirmationService: ConfirmationService
    ) {}

  ngOnInit(): void {
    this.idWarehouse = Number(this.route.snapshot.paramMap.get('id'));
    console.log('ID acquisito da snapshot:', this.idWarehouse);

    this.loadCategories();
    this.initForms();
    
  }

  initForms() {
    this.parentCategoryForm = this.fb.group({
      id: [null], // Aggiunto per gestire l'edit
      name: [''],
      description: [''],
      parentCategoryId: [null]
    });
    this.childCategoryForm = this.fb.group({
      id: [null], // Aggiunto per gestire l'edit
      name: [''],
      description: [''],
      parentCategoryId: [null]
    });
  }

  loadCategories() {

    this.categoryService.getAll().subscribe({
      next: categories => { 
        this.allCategories = categories;
        this.allCategoriesCopy = [...this.allCategories]; // Copia per il filtro
        this.parentCategories = this.allCategories.filter(c => !c.parentCategoryId);
        this.childCategories = this.allCategories.filter(c => c.parentCategoryId);
        this.messageService.add({ severity: 'success', summary: 'Caricamento dati', detail: 'Dati caricati con successo!', life: 2000 }); 
      },
      error: err => { this.messageService.add({ severity: 'error', summary: 'Caricamento dati', detail: 'Errore durante il caricamento dei dati. Errore:\n' + err, sticky: true }); }
    });

  }

  loadChildCategories() {
    if (this.selectedParent) {
      this.childCategories = this.allCategories.filter(c => c.parentCategoryId === this.selectedParent?.id);
    }
  }

  clearChildCategories() {
    this.childCategories = [];
    this.selectedParent = null;
  }

  showCreateDialogChildCategory(idParent: number | undefined) {
    this.displayChildCategoryDialog = true;
    this.isEditMode = false; // Reset edit mode
    this.childCategoryForm.reset();
    this.childCategoryForm.patchValue({ parentCategoryId: idParent });
  }

  showCreateDialogParentCategory() {
    this.displayParentCategoryDialog = true;
    this.isEditMode = false;
    this.parentCategoryForm.reset();
  }

  onRowEditInit(category: Category) {

    if (category.parentCategoryId !== null && category.parentCategoryId !== undefined) {
      this.childCategoryForm.patchValue({
        id: category.id,
        name: category.name,
        description: category.description,
        parentCategoryId: category.parentCategoryId
      });
      this.displayChildCategoryDialog = true;
      this.isEditMode = true;
    }
    else {
      this.parentCategoryForm.patchValue({
        id: category.id,
        name: category.name,
        description: category.description
      });
      this.displayParentCategoryDialog = true;
      this.isEditMode = true;
    }

  }

  onCreateCategory() {
    if (this.isEditMode === false) {
      this.categoryRequest.name = this.parentCategoryForm.getRawValue().name;
      this.categoryRequest.description = this.parentCategoryForm.getRawValue().description;
      this.categoryRequest.parentCategoryId = undefined;
      this.categoryService.create(this.categoryRequest).subscribe({
        next: (category) => {
          this.messageService.add({ severity: 'success', summary: 'Creazione categoria', detail: 'Categoria creata con successo!', life: 2000 });
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Creazione categoria', detail: 'Errore durante la creazione della categoria.', sticky: true });
        },
        complete: () => {
          this.displayParentCategoryDialog = false;
          this.loadCategories();
          this.parentCategoryForm.reset();
        }
      });
    } else {
      const categoryId = this.parentCategoryForm.getRawValue().id;
      this.categoryRequest.name = this.parentCategoryForm.getRawValue().name;
      this.categoryRequest.description = this.parentCategoryForm.getRawValue().description;
      this.categoryRequest.parentCategoryId = undefined;
      this.categoryService.update(categoryId, this.categoryRequest).subscribe({
        next: data => {
          this.messageService.add({ severity: 'success', summary: 'Aggiornamento categoria', detail: 'Categoria aggiornata con successo!', life: 2000 });
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Aggiornamento categoria', detail: 'Errore durante l\'aggiornamento della categoria.', sticky: true });
        },
        complete: () => {
          this.displayParentCategoryDialog = false;
          this.loadCategories();
          this.parentCategoryForm.reset();
        }
      });
    }
  }

  onCreateChildCategory() {
    if (this.isEditMode === false) {

      this.categoryRequest.name = this.childCategoryForm.getRawValue().name;
      this.categoryRequest.description = this.childCategoryForm.getRawValue().description;
      this.categoryRequest.parentCategoryId = this.childCategoryForm.getRawValue().parentCategoryId;

      this.categoryService.create(this.categoryRequest).subscribe({

        next: data => {
          this.messageService.add({ severity: 'success', summary: 'Creazione sotto categoria', detail: 'Sotto categoria creata con successo!', life: 2000 });
          this.loadCategories();
          this.loadChildCategories();
        },
        error: err => {
          this.messageService.add({ severity: 'error', summary: 'Creazione sotto categoria', detail: 'Errore durante la creazione della sotto categoria.', sticky: true });
        },
        complete: () => {
          this.displayChildCategoryDialog = false;
          this.childCategoryForm.reset();
        }
      });
    } else {

      const categoryId = this.childCategoryForm.getRawValue().id;
      this.categoryRequest.name = this.childCategoryForm.getRawValue().name;
      this.categoryRequest.description = this.childCategoryForm.getRawValue().description;
      this.categoryRequest.parentCategoryId = this.childCategoryForm.getRawValue().parentCategoryId;

      this.categoryService.update(categoryId, this.categoryRequest).subscribe({
        next: data => {
          this.messageService.add({ severity: 'success', summary: 'Aggiornamento sotto categoria', detail: 'Sotto categoria aggiornata con successo!', life: 2000 });
          this.loadCategories();
          this.loadChildCategories();
        },
        error: err => {
          this.messageService.add({ severity: 'error', summary: 'Aggiornamento sotto categoria', detail: 'Errore durante l\'aggiornamento della sotto categoria.', sticky: true });
        },
        complete: () => {
          this.displayChildCategoryDialog = false;
          this.childCategoryForm.reset();
        }
      });
    }
  }
  
  onDeleteChildCategory(id: number, event: Event) {

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Sei sicuro di voler eliminare questa sotto categoria? Questa azione è irreversibile e cancellerà tutti i dati associati.',
      header: 'Elimina sotto categoria',
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
        this.categoryService.delete(id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Elimina sotto categoria', detail: 'Sotto categoria eliminata con successo!' });
            this.loadCategories();
            this.loadChildCategories();
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: 'Elimina sotto categoria', detail: 'Errore durante l\'eliminazione della sotto categoria.' });
          }
        });
      },
      reject: () => {
          this.messageService.add({ severity: 'info', summary: 'Elimina sotto categoria', detail: 'Eliminazione sotto categoria annullata.' });
      },
    });

  }

  onDeleteParentCategory(id: number, event: Event) {

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Sei sicuro di voler eliminare questa categoria? Questa azione è irreversibile e cancellerà tutti i dati associati.',
      header: 'Elimina categoria',
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
        this.categoryService.delete(id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Elimina categoria', detail: 'Categoria eliminata con successo!' });
            this.loadCategories();
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: 'Elimina categoria', detail: 'Errore durante l\'eliminazione della categoria.' });
          }
        });
      },
      reject: () => {
          this.messageService.add({ severity: 'info', summary: 'Elimina categoria', detail: 'Eliminazione categoria annullata.' });
      },
    });

  }

  goBehind() {
    window.history.back();
  }

  onSearch(event: Event) {
    const searchValue = (event.target as HTMLInputElement).value.toLowerCase();
    if (!searchValue) {
      this.allCategories = [...this.allCategoriesCopy]; // Reset to original list if search is empty
      this.parentCategories = this.allCategories.filter(c => !c.parentCategoryId);
      this.childCategories = this.allCategories.filter(c => c.parentCategoryId);
      return;
    }

    // ﬁltro generale su allCategoriesCopy
    const filtered = this.allCategoriesCopy.filter(category =>
      category.name.toLowerCase().includes(searchValue) ||
      category.description.toLowerCase().includes(searchValue)
    );

    // suddivido genitori/figli dal filtered
    const directParents = filtered.filter(c => !c.parentCategoryId);
    const filteredChildren = filtered.filter(c => !!c.parentCategoryId);

    // estraggo gli id dei genitori trovati via sottocategorie
    const parentsFromChildrenIds = Array.from(new Set(
      filteredChildren.map(child => child.parentCategoryId!)
    ));

    // prendo gli oggetti genitore originali corrispondenti
    const parentsFromChildren = this.allCategoriesCopy
      .filter(c => parentsFromChildrenIds.includes(c.id));

    // ricostruisco le liste finali unendo i genitori "diretti" 
    // e quelli ricuperati dalle sottocategorie
    this.parentCategories = [
      ...directParents,
      ...parentsFromChildren
    ].filter((v, i, arr) => arr.findIndex(x => x.id === v.id) === i);

    // la lista dei figli rimane filteredChildren
    this.childCategories = filteredChildren;
  }

  onExportExcel() {
    if (!this.allCategories || this.allCategories.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Nessun dato',
        detail: 'Non ci sono categorie da esportare.',
        life: 2000
      });
      return;
    }
    import('xlsx').then(xlsx => {
      try {
        const worksheet = xlsx.utils.json_to_sheet(this.allCategories);
        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Categories');
        xlsx.writeFile(workbook, 'categories.xlsx');
        this.messageService.add({
          severity: 'success',
          summary: 'Esportazione completata',
          detail: 'Le categorie sono state esportate con successo.',
          life: 2000
        });
      } catch (error) {
        this.messageService.add({
          severity: 'error',
          summary: 'Errore esportazione',
          detail: 'Si è verificato un errore durante l\'esportazione.',
          life: 2000
        });
      }
    }).catch(() => {
      this.messageService.add({
        severity: 'error',
        summary: 'Errore libreria',
        detail: 'Impossibile caricare la libreria di esportazione.',
        life: 2000
      });
    });
  }
  
}
