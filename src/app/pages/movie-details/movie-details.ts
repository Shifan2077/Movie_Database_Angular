import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.html',
  imports: [CommonModule]
})
export class MovieDetailsComponent implements OnInit {
  movie: any;
  cast: any[] = [];
  watchLinks: any[] = [];

  constructor(private route: ActivatedRoute, private http: HttpClient, private location: Location) {}

  ngOnInit() {
    const movieId = this.route.snapshot.paramMap.get('id');
    if (movieId) {
      this.fetchMovieDetails(movieId);
      this.fetchWatchLinks(movieId);
    }
  }

  fetchMovieDetails(id: string) {
    const path = `movie/${id}?append_to_response=credits`;
    this.http
      .get<any>(`/api/tmdb`, { params: { path } })
      .subscribe((res) => {
        this.movie = res;
        this.cast = res.credits.cast.slice(0, 6); // first 6 cast members
      });
  }

  fetchWatchLinks(tmdbId: string) {
    // Step 1: Search by TMDB movie ID
    this.http
      .get<any>(`/api/watchmode`, { params: { path: `v1/search/?search_field=tmdb_movie_id&search_value=${tmdbId}` } })
      .subscribe((searchRes) => {
        if (searchRes.title_results && searchRes.title_results.length > 0) {
          const watchmodeId = searchRes.title_results[0].id;
  
          // Step 2: Get streaming sources for that Watchmode ID
          this.http
            .get<any>(`/api/watchmode`, { params: { path: `v1/title/${watchmodeId}/sources/?regions=IN` } })
            .subscribe((sourcesRes) => {
              this.watchLinks = sourcesRes;
            });
        } else {
          console.warn('No Watchmode title found for TMDB ID:', tmdbId);
        }
      });
  }
  
  

  getPosterUrl(path: string) {
    return `https://image.tmdb.org/t/p/w500${path}`;
  }

  goBack() {
    this.location.back(); // Goes to the previous route
  }
  
}
