import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-portfolio-wizard',
  standalone: true,
  imports: [FormsModule, InputTextModule],
  templateUrl: './portfolio-wizard.component.html',
  styleUrl: './portfolio-wizard.component.css',
})
export class PortfolioWizardComponent {}
