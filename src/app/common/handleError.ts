import { HttpErrorResponse } from '@angular/common/http';
import { AppError } from './app-error';
import { throwError } from 'rxjs';
import { BadInput } from './bad-input';
import { NotFoundError } from './not-found-error';
import { ForbbidenError } from './forbidden-error';
import { Unauthorized } from './unauthorized-error';
import { ConflictError } from './conflict-error';

export function customErrorHandler(error: HttpErrorResponse) {
  if (error.status === 404) {
    console.error('Service class 404 error');
    return throwError(() => new NotFoundError('Not found 404'));
  }
  if (error.status === 400) {
    console.error('400 Invalid Request was made');
    return throwError(() => new BadInput('Bad Request'));
  }

  if (error.status === 403) {
    console.error('403 Forbidden');
    return throwError(() => new ForbbidenError('Forbbiden 403'));
  }
  if (error.status === 401) {
    console.error('401 Unauthorized');
    return throwError(() => new Unauthorized('Unauthorized 401'));
  }

  if (error.status === 409) {
    console.error(error.error.message);
    return throwError(() => new ConflictError('Conflict 409'));
  }

  return throwError(() => new AppError(error));
}
