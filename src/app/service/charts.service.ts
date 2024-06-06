import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import {
  BehaviorSubject,
  Observable,
  catchError,
  combineLatest,
  merge,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { customErrorHandler } from '../errors/handleError';
import { PortfolioService } from './portfolio.service';
import { PiChart } from '../interfaces/charts.interfaces';
import { CentralizedStateService } from '../centralized-state.service';

export interface IChartsService {
  getPieChart(): Observable<PiChart[]>;
  triggerFetch(): void;
}

@Injectable({
  providedIn: 'root',
})
export class ChartsService implements IChartsService {
  private dataSubject = new BehaviorSubject<void>(undefined);
  data$: Observable<PiChart[]>;

  constructor(
    private http: HttpClient,
    private ps: PortfolioService,
    private cs: CentralizedStateService,
  ) {
    //initial way of triggering the fetch request when state changes
    // but after refactoring , the combineLatest is not needed
    // this.data$ = combineLatest<[void, boolean]>([
    //   this.dataSubject,
    //   this.cs.refresh$,
    // ]).pipe(switchMap(() => this.getPieChart()));

    //Easier to read and simpler implementation
    //the merge function should emit an observable when refresh OR subject emits
    this.data$ = merge(this.dataSubject, this.cs.refresh$).pipe(
      switchMap(() => this.getPieChart()),
    );
  }
  url: string = environment.apiUrl;

  getPieChart(): Observable<PiChart[]> {
    return this.http
      .get<
        PiChart[]
      >(`${this.url}swappy-portfolio-service/api/v1/portfolio/assets/pie`)
      .pipe(
        catchError((err) => {
          customErrorHandler(err);
          return of([]);
        }),
      );
  }
  triggerFetch() {
    this.dataSubject.next();
  }
}
