import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, timer } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject(false);

  loading$ = this.loadingSubject.asObservable();

  constructor() {}

  loadingOn() {
    console.log('loading on');
    this.loadingSubject.next(true);
  }

  loadingOff() {
    console.log('loading off (with delay)');
    // Adding a delay before turning off the loading indicator
    timer(500).subscribe(() => {
      this.loadingSubject.next(false);
    });
  }
}
