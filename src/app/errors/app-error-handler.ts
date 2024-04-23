import { ErrorHandler } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class AppErrorHandler implements ErrorHandler {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  handleError(error: any): void {
    if (isPlatformBrowser(this.platformId)) {
      console.log(error);
      alert('An unexpected error occurred!'); // Display alert only on client-side
    } else {
      console.error('An error occurred:', error); // Log the error on server-side
    }
  }
}
