import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseManageComponent } from './warehouse-manage.component';

describe('WarehouseComponent', () => {
  let component: WarehouseManageComponent;
  let fixture: ComponentFixture<WarehouseManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarehouseManageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarehouseManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
