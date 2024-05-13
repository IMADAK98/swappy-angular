import {
  ApplicationConfig,
  ErrorHandler,
  importProvidersFrom,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { authInterceptor } from './auth/auth.interceptor';
import { AppErrorHandler } from './errors/app-error-handler';
import { provideClientHydration } from '@angular/platform-browser';
import { loadinInterceptor } from './loadin.interceptor';
import { LoadingService } from './loading.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor, loadinInterceptor]),
    ),
    provideAnimations(),
    {
      provide: ErrorHandler,
      useClass: AppErrorHandler,
    },
    provideClientHydration(),
    importProvidersFrom(LoadingService),
  ],
};
