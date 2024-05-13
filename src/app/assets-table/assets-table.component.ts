import { Component, EventEmitter, Output } from '@angular/core';
import { TableModule } from 'primeng/table';
import { PanelModule } from 'primeng/panel';
import { AssetService } from '../service/asset.service';
import { Observable } from 'rxjs';
import { Asset } from '../interfaces/crypto.interfaces';
import { AsyncPipe } from '@angular/common';
import { NgOptimizedImage } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { WizardComponent } from '../wizard/wizard.component';
import { DialogModule } from 'primeng/dialog';
import { TransactionFormComponent } from '../transaction-form/transaction-form.component';
import { CommonModule } from '@angular/common';
import { LoadingIndicatorComponent } from '../loading-indicator/loading-indicator.component';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Router } from '@angular/router';
@Component({
  selector: 'app-assets-table',
  standalone: true,
  imports: [
    TableModule,
    PanelModule,
    AsyncPipe,
    NgOptimizedImage,
    ButtonModule,
    WizardComponent,
    DialogModule,
    TransactionFormComponent,
    CommonModule,
    LoadingIndicatorComponent,
    MenuModule,
    ConfirmDialogModule,
    ToastModule,
  ],
  templateUrl: './assets-table.component.html',
  styleUrl: './assets-table.component.css',
  providers: [ConfirmationService, MessageService],
})
export class AssetsTableComponent {
  @Output() complete = new EventEmitter();
  asset$: Observable<Asset[]> = new Observable<Asset[]>();
  items: MenuItem[] | undefined;
  $event!: Event;

  selectedItem: any = null;

  constructor(
    private assetService: AssetService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    console.log('asset table initialized');
    this.asset$ = this.assetService.fetchAssetsByPortfolioId(305);

    this.items = [
      {
        label: 'Options',
        items: [
          {
            label: 'View transactions',
            icon: 'pi pi-link',
            command: () => {
              this.router.navigate(['/transactions', this.selectedItem.id]);
            },
          },
          {
            label: 'Delete Asset',
            icon: 'pi pi-trash',
            command: () => {
              this.confirm(this.selectedItem);
            },
          },
        ],
      },
    ];
    // this.assetService
    //   .fetchAssetsByPortfolioId(305)
    //   .subscribe((data) => console.log(data));
  }

  handleFormCompletion() {
    this.visible = false;
    this.complete.emit();
  }

  visible: boolean = false;
  coinID = '';
  showDialog(assetCoinID: string) {
    console.log(assetCoinID);
    this.visible = true;
    this.coinID = assetCoinID;
    console.log(this.visible);
  }

  onDelete(assetId: number) {
    this.assetService.deleteAsset(assetId).subscribe({
      complete: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Deleted',
          detail: `Deleted successfully`,
        });
        this.complete.emit();
      },
    });
  }

  confirm(asset: Asset) {
    this.confirmationService.confirm({
      message:
        'Are you sure that you want to delete this asset and all associated transactions ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.onDelete(asset.id);
      },
    });
  }
}
