import { Asset } from './crypto.interfaces';

export interface Portfolio {
  id: number;
  name: string;
  userEmail: string;
  preferedCurrency: string;
  assets: Asset[];
  creationDate: Date;
  totalValue: number;
  totalProfitAndLossAmount: number;
}

export enum Action {
  BUY = 'BUY',
  SELL = 'SELL',
}
