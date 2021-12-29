export interface TChartConfig {
  chartTitle: string;
  groupId: string;
  project: { key: string; name: string; title: string };
  xAxisKey: { key: string; name: string };
  yAxisKey: { key: string; name: string };
  groupKey: { key: string; name: string; title: string };
  colorScale: any;
  cropSelected: boolean; // filter bars to selected one when click
}

export enum ETimeSlice {
  "15m" = "15min",
  "30m" = "30min",
  "1h" = "1hour",
  "3h" = "3hours",
  "6h" = "6hours",
  "1d" = "1day",
  "1w" = "1week",
  "1mon" = "1month",
  "3mon" = "2months",
  "1y" = "1year",
}
