import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

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
    console.log('loading off');
    this.loadingSubject.next(false);
  }
}
