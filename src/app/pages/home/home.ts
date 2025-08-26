import { Component, OnInit } from '@angular/core';
import { SupabaseService } from 'src/app/services/supabase.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
  standalone : true,
  imports: [CommonModule, FormsModule, RouterLink]
})
export class HomeComponent implements OnInit {
  movies: any[] = [];
  wishlist: Set<string> = new Set();
  currentPage = 1;
  totalPages = 10; // TMDB usually has many pages; adjust as needed
  searchQuery = '';
  userId: string | null = null;
  userAvatar: string | null = null;
userInitials: string = '';

  constructor(
    private supabaseService: SupabaseService,
    private http: HttpClient,
    private router: Router
  ) {}

  async ngOnInit() {
    // Get user
    const { data } = await this.supabaseService.getUser();
    if (data?.user) {
      this.userId = data.user.id;
      await this.loadWishlist();

      const email = data.user.email || '';
    this.userInitials = email.charAt(0).toUpperCase();

    // If using Supabase user_metadata for avatar
    this.userAvatar = data.user.user_metadata?.['avatar_url'] || null;
    }

    this.fetchMovies();
  }

  async loadWishlist() {
    if (!this.userId) return;
    const wishlistData = await this.supabaseService.getWishlist(this.userId);
    this.wishlist = new Set(wishlistData.map((item: any) => item.movie_id));
  }

  fetchMovies() {
    const path = this.searchQuery
      ? `search/movie?query=${this.searchQuery}&page=${this.currentPage}`
      : `movie/popular?page=${this.currentPage}`;

    this.http.get<any>(`/api/tmdb`, { params: { path } }).subscribe(res => {
      this.movies = res.results;
      this.totalPages = res.total_pages > 10 ? 10 : res.total_pages; // cap pages to 10 for UI
    });
  }

  async toggleWishlist(movie: any) {
    if (!this.userId) return;

    const isInList = this.wishlist.has(movie.id.toString());

    if (isInList) {
      await this.supabaseService.removeFromWishlist(this.userId, movie.id.toString());
      this.wishlist.delete(movie.id.toString());
    } else {
      await this.supabaseService.addToWishlist(this.userId, movie);
      this.wishlist.add(movie.id.toString());
    }
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.fetchMovies();
  }

  getPosterUrl(path: string) {
    return `https://image.tmdb.org/t/p/w500${path}`;
  }

  goToDetails(id: string) {
    this.router.navigate(['/movie', id]);
  }

  loadedImages: Set<number> = new Set();

}
