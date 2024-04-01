import { ErrorHandler, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppErrorHandler extends ErrorHandler {
  override handleError(error: any): void {
    alert('An unexpected error has occurred');
    console.error(error);
  }
}
