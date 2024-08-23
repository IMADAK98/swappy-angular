import { HttpClient, HttpParams } from '@angular/common/http';
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
import {
  BarChartResponse,
  ChartTypeParams,
  PiChart,
  PiChartResponse,
  SnapshotResponse,
} from '../interfaces/charts.interfaces';
import { CentralizedStateService } from '../centralized-state.service';

export interface IChartsService {
  getPieChart(): Observable<PiChartResponse> | undefined;
  triggerFetch(): void;
}

@Injectable({
  providedIn: 'root',
})
export class ChartsService implements IChartsService {
  private dataSubject = new BehaviorSubject<void>(undefined);
  data$: Observable<any>;

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
      switchMap(() => {
        return this.getPieChart();
      }),
    );
  }
  url: string = environment.apiUrl;

  getPieChart(): Observable<PiChartResponse> {
    return this.http
      .get<PiChartResponse>(
        `${this.url}swappy-portfolio-service/api/v1/charts/pie-chart`,
      )
      .pipe(catchError((err) => customErrorHandler(err)));
  }

  getLineChartData(): Observable<SnapshotResponse> {
    return this.http
      .get<SnapshotResponse>(
        `${this.url}swappy-portfolio-service/api/v1/charts/line-chart-snapshots`,
      )
      .pipe(catchError((err) => customErrorHandler(err)));
  }

  getBarChartData(input?: ChartTypeParams): Observable<BarChartResponse> {
    let params = new HttpParams();

    if (input) {
      params = params.append('input', input);
    }

    return this.http
      .get<BarChartResponse>(
        `${this.url}swappy-portfolio-service/api/v1/charts/bar-chart`,
        { params },
      )
      .pipe(catchError((err) => customErrorHandler(err)));
  }

  triggerFetch() {
    this.dataSubject.next();
  }
}
