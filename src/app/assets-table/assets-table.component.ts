import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { PanelModule } from 'primeng/panel';
@Component({
  selector: 'app-assets-table',
  standalone: true,
  imports: [TableModule, PanelModule],
  templateUrl: './assets-table.component.html',
  styleUrl: './assets-table.component.css',
})
export class AssetsTableComponent {
  products = [
    {
      code: 'PRD-123',
      name: 'Product A',
      category: 'Electronics',
      quantity: 10,
    },
    { code: 'PRD-456', name: 'Product B', category: 'Clothing', quantity: 5 },
    { code: 'PRD-789', name: 'Product C', category: 'Furniture', quantity: 2 },
    // ... add more product objects as needed
  ];
}
