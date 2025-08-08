import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { createClient } from '@supabase/supabase-js';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from 'D:/moviesdb/Movies_Angular/movie-database/src/environment/environment';


@Component({
  standalone: true,
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent implements OnInit {
  posters: string[] = [];
  email: string = '';
  password: string = '';
  loading = false;
  errorMessage: string = '';

  isFlipped = false;


  apiKey = 'cf718a3e3e187f475aa3f100b8c305cd';
  baseImageUrl = 'https://image.tmdb.org/t/p/w500';

  supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.http.get(`https://api.themoviedb.org/3/trending/movie/week?api_key=${this.apiKey}`)
      .subscribe((data: any) => {
        this.posters = data.results.map((movie: any) =>
          this.baseImageUrl + movie.poster_path
        );
      });
  }

  async loginUser() {
    this.loading = true;
    this.errorMessage = '';

    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: this.email,
      password: this.password,
    });

    this.loading = false;

    if (error) {
      this.errorMessage = error.message;
    } else {
      this.router.navigate(['/details']); // or wherever you want to go
    }
  }

  goToSignup() {
    this.router.navigate(['/signup']);
  }
}
