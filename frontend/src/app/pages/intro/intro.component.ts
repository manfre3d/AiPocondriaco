import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-intro',
  standalone: true,
  imports: [],
  templateUrl: './intro.component.html',
  styleUrl: './intro.component.scss'
})
export class IntroComponent {
  constructor(private router: Router) {}

  navigateToHome(): void {
    this.router.navigate(['/homepage']);
  }
}
