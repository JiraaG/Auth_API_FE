import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-home',
  imports: [CardModule, ButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void { }

  onGoToMagazzino() {
    this.router.navigate(['warehouse']);
  }

  onGoToChartWH() {
    this.router.navigate(['chart-wh']);
  }
}
