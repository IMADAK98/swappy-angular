import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { PortfolioComponent } from '../new-portfolio-form/new-portfolio-form.component';

@Component({
  selector: 'no-portfolio',
  standalone: true,
  templateUrl: './no-portfolio.component.html',
  styleUrl: './no-portfolio.component.css',
  imports: [DialogModule, NgOptimizedImage, ButtonModule, PortfolioComponent],
})
export class NoPortfolioComponent {
  visible: boolean = false;

  showFormDialog = false;

  showDialog() {
    this.visible = true;
  }

  showForm() {
    this.showFormDialog = true;
  }
}
