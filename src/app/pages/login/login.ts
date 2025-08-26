import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent implements OnInit {
  posters: string[] = [];

  // Login fields
  email = '';
  password = '';

  // Signup fields
  signupName = '';
  signupEmail = '';
  signupPassword = '';

  loading = false;
  errorMessage = '';
  successMessage = '';

  isFlipped = false;

  // Removed API key; using Netlify proxy instead
  baseImageUrl = 'https://image.tmdb.org/t/p/w500';

  constructor(
    private http: HttpClient,
    private router: Router,
    private supabaseService: SupabaseService
  ) {}

  ngOnInit(): void {
    this.http
      .get(`/api/tmdb`, { params: { path: 'trending/movie/week' } })
      .subscribe((data: any) => {
        this.posters = data.results.map((movie: any) =>
          this.baseImageUrl + movie.poster_path
        );
      });
  }

  // LOGIN
  async loginUser() {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const { data, error } = await this.supabaseService.login(this.email, this.password);

    this.loading = false;

    if (error) {
      this.errorMessage = error.message;
    } else {
      this.router.navigate(['/home']);
    }
  }

  // SIGNUP
  async signupUser() {
    if (!this.signupEmail || !this.signupPassword) {
      this.errorMessage = 'Email and password are required.';
      return;
    }

    if (this.signupPassword.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const { data, error } = await this.supabaseService.signup(
      this.signupEmail,
      this.signupPassword
    );

    this.loading = false;

    if (error) {
      this.errorMessage = error.message;
    } else {
      this.successMessage = 'Signup successful! Check your email for confirmation.';
      this.isFlipped = false;
    }
  }

  goToSignup() {
    this.isFlipped = true;
  }

  goToLogin() {
    this.isFlipped = false;
  }
}
