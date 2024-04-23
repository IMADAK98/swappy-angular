export interface Portfolio {
  id: number;
  name: string;
  userEmail: string;
  preferedCurrency: string;
  // asset: Asset[];
  creationDate: Date;
  totalValue: number;
}

export enum Action {
  BUY = 'BUY',
  SELL = 'SELL',
}
