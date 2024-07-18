import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { ErrorPageComponent } from './pages/error-page/error-page.component';

export const routes: Routes = [
    { "path": "", "component": LoginComponent },
    { "path": "login", "component": LoginComponent },
    { "path": "homepage", "component": HomepageComponent },
    { 'path': 'error', component: ErrorPageComponent }
  ];

