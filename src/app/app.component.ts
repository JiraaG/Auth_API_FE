import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutComponent } from "./A-Layout/layout/layout.component";

@Component({
  selector: 'app-root',
  // RouterOutlet,
  imports: [LayoutComponent], 
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Auth_API_FE';
}
