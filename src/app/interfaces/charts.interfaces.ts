import { BaseResponse } from './BaseResponse';

export interface PiChart {
  coinName: string;
  piPercentage: number;
}

export interface SnapshotDto {
  totalValue: number;
  snapshotDate: Date;
}

export interface PiChartResponse extends BaseResponse<PiChart[]> {}
export interface SnapshotResponse extends BaseResponse<SnapshotDto[]> {}
