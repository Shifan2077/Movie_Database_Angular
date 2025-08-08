import { provideRouter } from '@angular/router'; // ✅ Add this
import { provideHttpClient } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { routes } from './app/app.routes'; // your route config

bootstrapApplication(App, {
  providers: [provideRouter(routes), provideHttpClient()],
});
