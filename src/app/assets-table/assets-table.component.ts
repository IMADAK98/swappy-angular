import { Component, EventEmitter, Output } from '@angular/core';
import { TableModule } from 'primeng/table';
import { PanelModule } from 'primeng/panel';
import { AssetService } from '../service/asset.service';
import { Observable, map } from 'rxjs';
import { Asset } from '../interfaces/crypto.interfaces';
import { AsyncPipe } from '@angular/common';
import { NgOptimizedImage } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { WizardComponent } from '../wizard/wizard.component';
import { DialogModule } from 'primeng/dialog';
import { TransactionFormComponent } from '../transaction-form/transaction-form.component';
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
  ],
  templateUrl: './assets-table.component.html',
  styleUrl: './assets-table.component.css',
})
export class AssetsTableComponent {
  @Output() complete = new EventEmitter();
  asset$: Observable<Asset[]> = new Observable<Asset[]>();

  constructor(private assetService: AssetService) {}

  ngOnInit(): void {
    console.log('asset table initialized');
    this.asset$ = this.assetService.fetchAssetsByPortfolioId(305);

    // this.assetService
    //   .fetchAssetsByPortfolioId(305)
    //   .subscribe((data) => console.log(data));
  }

  handleFormCompletion() {
    this.visible = false;
    this.ngOnInit();
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
}
