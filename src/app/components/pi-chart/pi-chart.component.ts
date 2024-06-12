import { Component, OnInit } from '@angular/core';
import { ChartsService } from '../../service/charts.service';
import { PiChart } from '../../interfaces/charts.interfaces';
import { ChartModule } from 'primeng/chart';
@Component({
  selector: 'app-pie-chart',
  standalone: true,
  templateUrl: './pi-chart.component.html',
  styleUrls: ['./pi-chart.component.css'],
  imports: [ChartModule],
})
export class PiChartComponent implements OnInit {
  data: any;
  options: any;

  constructor(private cs: ChartsService) {}

  ngOnInit() {
    this.cs.data$.subscribe((responseData) => {
      if (responseData && responseData.length > 0) {
        this.data = this.transformData(responseData);
      }
    });
    this.options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
          },
        },
      },
    };
  }

  transformData(responseData: PiChart[]): any {
    const labels = responseData.map((item) => item.coinName);
    const data = responseData.map((item) => item.piPercentage);
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
