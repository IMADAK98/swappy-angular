import { BaseResponse } from './BaseResponse';

export interface PiChart {
  coinName: string;
  piPercentage: number;
}

export interface SnapshotDto {
  totalValue: number;
  snapshotDate: Date;
}

export enum ChartTypeParams {
  VALUE,
  QUANTITY,
}

export interface BarChartDto {
  assetName: string;
  assetValue: number;
  assetQuantity: number;
  coinId: string;
  assetSymbol: string;
}
export interface BarChartResponse extends BaseResponse<BarChartDto[]> {}
export interface PiChartResponse extends BaseResponse<PiChart[]> {}
export interface SnapshotResponse extends BaseResponse<SnapshotDto[]> {}
