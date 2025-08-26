import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-landing',
  templateUrl: './landing.html',
  styleUrls: ['./landing.scss'],
  imports: [CommonModule, RouterLink],
})
export class LandingComponent implements OnInit {
  trendingMovies: any[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.http.get<any>('/api/tmdb', { params: { path: 'trending/movie/day' } })
      .subscribe((res) => {
        this.trendingMovies = res.results; // ✅ Store full movie objects
      });
  }

  getPosterUrl(path: string): string {
    return `https://image.tmdb.org/t/p/w500${path}`;
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
