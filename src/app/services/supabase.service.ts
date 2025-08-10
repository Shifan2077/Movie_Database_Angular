import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey);
  }

  // Expose the raw client if needed
  get client() {
    return this.supabase;
  }

  // Auth methods
  login(email: string, password: string) {
    return this.supabase.auth.signInWithPassword({ email, password });
  }

  signup(email: string, password: string) {
    return this.supabase.auth.signUp({ email, password });
  }

  logout() {
    return this.supabase.auth.signOut();
  }

  getUser() {
    return this.supabase.auth.getUser();
  }


  // ====================
  // Wishlist methods
  // ====================

  async getWishlist(userId: string) {
    const { data, error } = await this.supabase
      .from('wishlist')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return data;
  }

  async addToWishlist(userId: string, movie: any) {
    const { data, error } = await this.supabase
      .from('wishlist')
      .insert([{
        user_id: userId,
        movie_id: movie.id,
        movie_title: movie.title || movie.name,
        poster_path: movie.poster_path,
        rating: movie.vote_average
      }]);

    if (error) throw error;
    return data;
  }

  async removeFromWishlist(userId: string, movieId: string) {
    const { data, error } = await this.supabase
      .from('wishlist')
      .delete()
      .eq('user_id', userId)
      .eq('movie_id', movieId);

    if (error) throw error;
    return data;
  }

  async isInWishlist(userId: string, movieId: string) {
    const { data, error } = await this.supabase
      .from('wishlist')
      .select('id')
      .eq('user_id', userId)
      .eq('movie_id', movieId)
      .maybeSingle();

    if (error) throw error;
    return !!data;
  }


  // Upload avatar to Storage and update user metadata
async uploadAvatar(file: File, userId: string) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}.${fileExt}`;
  const filePath = `${fileName}`;

  // Upload to 'avatars' bucket
  const { error: uploadError } = await this.supabase
    .storage
    .from('avatars')
    .upload(filePath, file, { upsert: true });

  if (uploadError) throw uploadError;

  // Get public URL
  const { data } = this.supabase
    .storage
    .from('avatars')
    .getPublicUrl(filePath);

  const publicUrl = data.publicUrl;

  // Update user metadata
  const { error: updateError } = await this.supabase.auth.updateUser({
    data: { avatar_url: publicUrl }
  });

  if (updateError) throw updateError;

  return publicUrl;
}
}
