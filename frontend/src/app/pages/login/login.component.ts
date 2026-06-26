import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { WebService } from '../../services/web.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  mode: 'login' | 'register' = 'login';

  // Login fields
  email = '';
  password = '';

  // Register fields
  name = '';
  regEmail = '';
  regPassword = '';
  confirmPassword = '';

  isLoading = false;
  errorMessage = '';

  constructor(private router: Router, private webService: WebService) {}

  setMode(m: 'login' | 'register') {
    this.mode = m;
    this.errorMessage = '';
  }

  goBack(e: Event) {
    e.preventDefault();
    this.router.navigate(['/']);
  }

  login() {
    this.errorMessage = '';
    if (!this.email.trim() || !this.password.trim()) {
      this.errorMessage = 'Please enter your email and password.';
      return;
    }
    this.isLoading = true;
    this.webService.login(this.email, this.password).subscribe({
      next: (res) => {
        localStorage.setItem('sessionId', res.sessionId);
        this.isLoading = false;
        this.router.navigate(['/homepage']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.error?.error ?? 'Login failed. Please try again.';
      },
    });
  }

  register() {
    this.errorMessage = '';
    if (this.regPassword !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }
    this.isLoading = true;
    this.webService.register(this.name, this.regEmail, this.regPassword, this.confirmPassword).subscribe({
      next: (res) => {
        localStorage.setItem('sessionId', res.sessionId);
        this.isLoading = false;
        this.router.navigate(['/homepage']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.error?.error ?? 'Registration failed. Please try again.';
      },
    });
  }
}
