import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { ErrorPageComponent } from './pages/error-page/error-page.component';
import { IntroComponent } from './pages/intro/intro.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: IntroComponent, data: { animation: 'IntroPage' } },
  { path: 'login', component: LoginComponent },
  { path: 'homepage', component: HomepageComponent, canActivate: [authGuard], data: { animation: 'HomePage' } },
  { path: 'error', component: ErrorPageComponent },
  { path: '**', redirectTo: '/error' },
];
