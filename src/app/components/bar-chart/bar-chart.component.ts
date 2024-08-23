import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { ChartsService } from '../../services/charts.service';
import {
  BarChartDto,
  BarChartResponse,
} from '../../interfaces/charts.interfaces';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'bar-chart',
  standalone: true,
  imports: [ChartModule],
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.css',
})
export class BarChartComponent implements OnInit {
  basicData: any;

  basicOptions: any;
  destroy$: Subject<void> = new Subject();

  constructor(private chartService: ChartsService) {}

  ngOnInit() {
    this.chartService
      .getBarChartData()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: BarChartResponse) => {
          if (res && res.data.length > 0) {
            this.basicData = this.transformData(res.data);
          }
        },
      });

    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary',
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.basicOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
        x: {
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
  }

  transformData(responseData: BarChartDto[]): any {
    const labels = responseData.map((data) => data.assetSymbol);
    const data = responseData.map((data) => data.assetValue);
    const backgroundColors = this.generateColors(responseData.length);
    const hoverBackgroundColors = backgroundColors; // Same colors for hover effect

    return {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: backgroundColors,
          hoverBackgroundColor: hoverBackgroundColors,
        },
      ],
    };
  }

  generateColors(count: number): string[] {
    const colors = [];
    for (let i = 0; i < count; i++) {
      colors.push(this.getRandomColor());
    }
    return colors;
  }

  getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}
