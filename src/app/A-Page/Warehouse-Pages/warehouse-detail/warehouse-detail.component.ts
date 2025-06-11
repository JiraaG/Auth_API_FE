import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-warehouse-detail',
  imports: [],
  standalone: true,
  templateUrl: './warehouse-detail.component.html',
  styleUrl: './warehouse-detail.component.scss'
})
export class WarehouseDetailComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
    console.log('WarehouseDetailComponent initialized');
  }
}
