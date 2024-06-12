import { Asset } from './crypto.interfaces';

export interface Portfolio {
  id: number;
  portfolioName: string;
  userEmail: string;
  assets: Asset[];
  creationDate: Date;
  totalValue: number;
  totalProfitAndLossAmount: number;
}

export interface PortfolioRequest {
  portfolioName: string;
}

export enum Action {
  BUY = 'BUY',
  SELL = 'SELL',
}
