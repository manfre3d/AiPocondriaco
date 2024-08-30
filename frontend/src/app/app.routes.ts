import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { ErrorPageComponent } from './pages/error-page/error-page.component';
import { IntroComponent } from './pages/intro/intro.component';

export const routes: Routes = [
    { "path": "", "component": IntroComponent },
    // { "path": "", "component": LoginComponent },
    { "path": "login", "component": LoginComponent },
    { "path": "homepage", "component": HomepageComponent, data: { animation: 'HomePage' }  },
    { "path": "intro", "component": IntroComponent, data: { animation: 'IntroPage' }  },
    { path: 'error', component: ErrorPageComponent },
    { path: '**', redirectTo: '/error' }
  ];

