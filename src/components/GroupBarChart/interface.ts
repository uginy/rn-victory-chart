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
