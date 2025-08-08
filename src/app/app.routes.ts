import { Routes } from '@angular/router';
import { SignupComponent } from './pages/signup/signup';
import { LandingComponent } from './pages/landing/landing';
import { LoginComponent } from './pages/login/login';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent }
];
