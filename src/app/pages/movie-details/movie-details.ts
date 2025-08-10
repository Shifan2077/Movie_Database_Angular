import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.html',
  imports: [CommonModule]
})
export class MovieDetailsComponent implements OnInit {
  movie: any;
  cast: any[] = [];
  watchLinks: any[] = [];

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    const movieId = this.route.snapshot.paramMap.get('id');
    if (movieId) {
      this.fetchMovieDetails(movieId);
      this.fetchWatchLinks(movieId);
    }
  }

  fetchMovieDetails(id: string) {
    this.http
      .get<any>(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${environment.tmdbApiKey}&append_to_response=credits`
      )
      .subscribe((res) => {
        this.movie = res;
        this.cast = res.credits.cast.slice(0, 6); // first 6 cast members
      });
  }

  fetchWatchLinks(id: string) {
    this.http
      .get<any>(
        `https://api.watchmode.com/v1/title/tmdb-${id}/sources/?apiKey=${environment.watchmodeApiKey}`
      )
      .subscribe((res) => {
        this.watchLinks = res;
      });
  }

  getPosterUrl(path: string) {
    return `https://image.tmdb.org/t/p/w500${path}`;
  }
}
