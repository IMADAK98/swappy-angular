import { Component } from '@angular/core';
import { CardComponent } from '../../card/card.component';
import { AssetsTableComponent } from '../assets-table/assets-table.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Asset, Transactions } from '../../interfaces/crypto.interfaces';
import { TransactionService } from '../../service/transaction.service';
import { Observable, map, of, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { PortfolioService } from '../../service/portfolio.service';
import { HeaderComponent } from '../../header/header.component';
import { NgOptimizedImage } from '@angular/common';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';

interface TransactionPageData {
  transactions: Transactions[];
  asset: Asset | undefined;
}

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    CardComponent,
    AssetsTableComponent,
    AsyncPipe,
    HeaderComponent,
    NgOptimizedImage,
    CommonModule,
    CardModule,
    TableModule,
    ButtonModule,
    RouterLink,
  ],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css',
})
export class TransactionsComponent {
  assetId!: number;
  transactionPageData$!: Observable<TransactionPageData> | null;
  constructor(
    private route: ActivatedRoute,
    private service: TransactionService,
    private ps: PortfolioService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.assetId = parseInt(id!, 10);

    this.transactionPageData$ = this.ps.getPortfolio().pipe(
      map((portfolio) => {
        const asset = portfolio?.assets.find((a) => a.id === this.assetId);
        console.log(asset);
        console.log(asset?.transactions.length);
        return {
          asset,
          transactions: asset?.transactions || [],
        };
      }),
    );
  }

  onBack() {
    this.router.navigateByUrl('/dashboard');
  }
}
