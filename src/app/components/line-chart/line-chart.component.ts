import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { ChartsService } from '../../services/charts.service';
import { SnapshotResponse } from '../../interfaces/charts.interfaces';
import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [ChartModule],
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.css',
})
export class LineChartComponent implements OnInit, OnDestroy {
  data: any;

  options: any;
  destroy$: Subject<void> = new Subject();

  constructor(private chartService: ChartsService) {}

  ngOnInit() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary',
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.chartService
      .getLineChartData()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: SnapshotResponse) => {
          const chartData = this.transformData(response.data);

          this.data = {
            labels: chartData.labels,
            datasets: [
              {
                label: 'Portfolio Value',
                data: chartData.values,
                fill: true,
                borderColor: documentStyle.getPropertyValue('--blue-500'),
                tension: 0.4,
              },
            ],
          };

          this.options = {
            maintainAspectRatio: false,
            aspectRatio: 0.6,
            plugins: {
              legend: {
                labels: {
                  color: textColor,
                },
              },
            },
            scales: {
              x: {
                ticks: {
                  color: textColorSecondary,
                },
                grid: {
                  color: surfaceBorder,
                  drawBorder: false,
                },
              },
              y: {
                ticks: {
                  color: textColorSecondary,
                },
                grid: {
                  color: surfaceBorder,
                  drawBorder: false,
                },
              },
            },
          };
        },
        error: (err: any) => {
          console.error('Error fetching snapshot data', err);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private transformData(data: any[]) {
    const labels = data.map((snapshot) =>
      new Date(snapshot.snapshotDate).toLocaleString(),
    );
    const values = data.map((snapshot) => snapshot.totalValue);
    return { labels, values };
  }
}
