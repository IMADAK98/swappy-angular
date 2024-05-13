import { Component } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { AssetsTableComponent } from '../assets-table/assets-table.component';
import { ActivatedRoute } from '@angular/router';
import { Transaction } from '../interfaces/crypto.interfaces';
import { TransactionService } from '../service/transaction.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CardComponent, AssetsTableComponent, AsyncPipe],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css',
})
export class TransactionsComponent {
  assetId!: number;
  transaction$: Observable<Transaction[]> | undefined;
  constructor(
    private route: ActivatedRoute,
    private service: TransactionService,
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    const id = this.route.snapshot.paramMap.get('id');
    this.assetId = parseInt(id!, 10);

    this.transaction$ = this.service.getTransactionsByAssetId(this.assetId);
  }
}
