export interface TChartConfig {
  chartTitle: string;
  groupId: string;
  xAxisKey: { key: string; name: string };
  yAxisKey: { key: string; name: string };
  groupKey: { key: string; name: string };
  colorScale: {
    [key: string]: string;
  };
  cropSelected: boolean; // filter bars to selected one when click
}
