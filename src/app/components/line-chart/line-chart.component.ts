import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { ChartsService } from '../../services/charts.service';
import {
  LineChartParams,
  SnapshotResponse,
} from '../../interfaces/charts.interfaces';
import { Subject, takeUntil } from 'rxjs';
import {
  SelectButtonChangeEvent,
  SelectButtonModule,
} from 'primeng/selectbutton';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SkeletonModule } from 'primeng/skeleton';
import { LoadingIndicatorComponent } from '../../loading-indicator/loading-indicator.component';
import { UIChart } from 'primeng/chart';
import { Chart, ChartOptions, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { enUS } from 'date-fns/locale';

Chart.register(...registerables);

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [
    FormsModule,
    ChartModule,
    SelectButtonModule,
    CommonModule,
    SkeletonModule,
    LoadingIndicatorComponent,
  ],
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.css',
})
export class LineChartComponent implements OnInit, OnDestroy {
  @ViewChild('chart') chart!: UIChart;

  data: any;
  options!: ChartOptions;
  destroy$: Subject<void> = new Subject();
  stateOptions: any[] = [
    { label: '1h', value: LineChartParams.HOUR },
    { label: '24h', value: LineChartParams.DAY },
    { label: '7d', value: LineChartParams.WEEK },
    { label: '30d', value: LineChartParams.MONTH },
    { label: 'All', value: LineChartParams.ALL },
  ];
  value: LineChartParams = LineChartParams.DAY;

  documentStyle: any;
  textColor: any;
  textColorSecondary: any;
  surfaceBorder: any;

  constructor(private chartService: ChartsService) {}

  ngOnInit() {
    this.initializeStyles();
    this.fetchChartData();
  }

  onFilterChange(event: SelectButtonChangeEvent) {
    if (event.value !== null && event.value !== undefined) {
      this.value = event.value;
      this.chartService.updateLineChartFilter(event.value);
      this.fetchChartData();
    }
  }

  setChartData(chartData: any) {
    this.data = {
      labels: chartData.labels,
      datasets: [
        {
          label: 'Portfolio Value',
          data: chartData.values,
          fill: true,
          borderColor: this.documentStyle.getPropertyValue('--blue-500'),
          tension: 0,
        },
      ],
    };

    this.options = this.getChartOptions();

    // Force chart update
    if (this.chart && this.chart.chart) {
      this.chart.chart.update();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeStyles() {
    this.documentStyle = getComputedStyle(document.documentElement);
    this.textColor = this.documentStyle.getPropertyValue('--text-color');
    this.textColorSecondary = this.documentStyle.getPropertyValue(
      '--text-color-secondary',
    );
    this.surfaceBorder =
      this.documentStyle.getPropertyValue('--surface-border');
  }

  private fetchChartData() {
    this.chartService
      .getLineChartData()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: SnapshotResponse) => {
          const chartData = this.transformData(response.data);
          this.setChartData(chartData);
        },
        error: (err: any) => {
          console.error('Error fetching snapshot data', err);
        },
      });
  }

  private transformData(data: any[]) {
    return {
      labels: data.map((snapshot) => new Date(snapshot.snapshotDate)),
      values: data.map((snapshot) => ({
        x: new Date(snapshot.snapshotDate),
        y: snapshot.totalValue,
      })),
    };
  }

  private getChartOptions(): ChartOptions {
    return {
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: this.textColor,
          },
        },
        tooltip: {
          mode: 'index',
          intersect: false,
        },
      },
      scales: {
        x: {
          type: 'time',
          adapters: {
            date: {
              locale: enUS,
            },
          },
          ticks: {
            color: this.textColorSecondary,
            maxTicksLimit: this.getMaxTicksLimit(),
          },
          grid: {
            display: false, // Turn off the x-axis grid lines
          },
        },
        y: {
          ticks: {
            color: this.textColorSecondary,
          },
          grid: {
            color: this.surfaceBorder,
          },
        },
      },
    };
  }

  private getTimeConfig() {
    switch (this.value) {
      case LineChartParams.HOUR:
        return { unit: 'minute', displayFormats: { minute: 'HH:mm:ss' } };
      case LineChartParams.DAY:
        return { unit: 'hour', displayFormats: { hour: 'HH:mm' } };
      case LineChartParams.WEEK:
        return { unit: 'day', displayFormats: { day: 'EEE' } };
      case LineChartParams.MONTH:
        return { unit: 'day', displayFormats: { day: 'MMM d' } };
      case LineChartParams.ALL:
        return { unit: 'month', displayFormats: { month: 'MMM yyyy' } };
    }
  }

  private getMaxTicksLimit() {
    switch (this.value) {
      case LineChartParams.HOUR:
        return 60;
      case LineChartParams.DAY:
        return 24;
      case LineChartParams.WEEK:
        return 7;
      case LineChartParams.MONTH:
        return 10;
      case LineChartParams.ALL:
        return 12;
    }
  }
}
