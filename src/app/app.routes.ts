import { Routes } from '@angular/router';
import { SignupComponent } from './pages/signup/signup';
import { LandingComponent } from './pages/landing/landing';
import { LoginComponent } from './pages/login/login';
import { HomeComponent } from './pages/home/home';
import { ProfileComponent } from './pages/profile/profile';
import { MovieDetailsComponent } from './pages/movie-details/movie-details';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'home', component: HomeComponent},
  { path: 'profile', component: ProfileComponent },
  { path: 'movie/:id', component: MovieDetailsComponent }

];
