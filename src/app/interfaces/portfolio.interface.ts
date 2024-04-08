export interface Asset {
  id: number;
  name: string;
  amount: number;
  purchaseAmount: number;
  purchaseDate: Date;
  action: string;
}

export interface Portfolio {
  id: number;
  name: string;
  userEmail: string;
  preferedCurrency: string;
  asset: Asset[];
  creationDate: Date;
}
