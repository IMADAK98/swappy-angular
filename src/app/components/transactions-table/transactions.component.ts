import { Component } from '@angular/core';
import { CardComponent } from '../../card/card.component';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AssetDto,
  AssetResponse,
  TransactionDto,
} from '../../interfaces/crypto.interfaces';
import { Observable, map } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { NgOptimizedImage } from '@angular/common';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { AssetService } from '../../service/asset.service';
import { response } from 'express';
import { MenuModule } from 'primeng/menu';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { TransactionService } from '../../service/transaction.service';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    CardComponent,
    AsyncPipe,
    NgOptimizedImage,
    CommonModule,
    CardModule,
    TableModule,
    ButtonModule,
    MenuModule,
    ConfirmDialogModule,
    ToastModule,
  ],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css',
  providers: [ConfirmationService, MessageService],
})
export class TransactionsComponent {
  assetId: number | undefined;
  transactionPageData$: Observable<AssetDto | undefined> | undefined;
  items: MenuItem[] | undefined;
  selectedItem: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private transactionService: TransactionService,
  ) {}

  ngOnInit(): void {
    this.initObservable();
    this.initMenuItems();
  }

  initObservable() {
    const id = this.route.snapshot.paramMap.get('id');
    this.assetId = parseInt(id!, 10);

    this.transactionPageData$ = this.transactionService
      .fetchTransactionsByAssetId(this.assetId)
      .pipe(
        map((response: AssetResponse) => {
          if (response.data) {
            return response.data;
          } else {
            this.router.navigate(['/dashboard']);
            return undefined;
          }
        }),
      );
  }

  initMenuItems() {
    this.items = [
      {
        label: 'Options',
        items: [
          {
            label: 'Edit Transaction',
            icon: 'pi pi-link',
            command: () => {
              this.router.navigate([]);
            },
          },
          {
            label: 'Delete Transaction',
            icon: 'pi pi-trash',
            command: () => {
              this.confirm(this.selectedItem);
            },
          },
        ],
      },
    ];
  }

  confirm(transaction: TransactionDto) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this transaction ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.onDelete(transaction.id);
      },
    });
  }

  onDelete(transactionId: number) {
    this.transactionService.deleteTransactionById(transactionId).subscribe({
      complete: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Deleted',
          detail: `Deleted successfully`,
        });
        window.location.reload();
      },
    });
  }

  onBack() {
    this.router.navigateByUrl('/dashboard');
  }
}
