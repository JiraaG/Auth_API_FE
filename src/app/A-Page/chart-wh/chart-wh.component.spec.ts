import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartWhComponent } from './chart-wh.component';

describe('ChartWhComponent', () => {
  let component: ChartWhComponent;
  let fixture: ComponentFixture<ChartWhComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartWhComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartWhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
