import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss'],
  imports: [CommonModule, RouterLink]
})
export class ProfileComponent implements OnInit {
  user: any = null;
  wishlist: any[] = [];
  avatarUrl: string | null = null;
  uploading = false;

  constructor(private supabaseService: SupabaseService) {}

  async ngOnInit() {
    const { data } = await this.supabaseService.getUser();
    if (data?.user) {
      this.user = data.user;
      this.avatarUrl = this.user.user_metadata?.['avatar_url'] || null;
      this.wishlist = await this.supabaseService.getWishlist(this.user.id);
    }
  }

  getPosterUrl(path: string) {
    return `https://image.tmdb.org/t/p/w500${path}`;
  }

  async removeFromWishlist(movieId: string) {
    if (!this.user) return;
    await this.supabaseService.removeFromWishlist(this.user.id, movieId);
    this.wishlist = this.wishlist.filter(m => m.movie_id !== movieId);
  }

  async onAvatarChange(event: any) {
    const file = event.target.files[0];
    if (!file || !this.user) return;

    this.uploading = true;
    try {
      const url = await this.supabaseService.uploadAvatar(file, this.user.id);
      this.avatarUrl = url;
    } catch (error) {
      console.error('Error uploading avatar:', error);
    } finally {
      this.uploading = false;
    }
  }

  async logout() {
    await this.supabaseService.logout();
    window.location.href = '/login'; // redirect after logout
  }
}
