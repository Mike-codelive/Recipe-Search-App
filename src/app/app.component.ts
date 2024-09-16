import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { RecipesComponent } from './recipes/recipes.component';
// import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, RecipesComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {}
