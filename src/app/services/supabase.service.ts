import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
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
}
