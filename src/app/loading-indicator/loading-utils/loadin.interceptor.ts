import { HttpContextToken, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoadingService } from './loading.service';
import { finalize } from 'rxjs';

export const SkipLoading = new HttpContextToken<boolean>(() => false);

export const loadinInterceptor: HttpInterceptorFn = (req, next) => {
  const loading = inject(LoadingService);

  if (req.context.get(SkipLoading)) {
    return next(req);
  }

  loading.loadingOn();

  return next(req).pipe(
    finalize(() => {
      loading.loadingOff();
    }),
  );
};
