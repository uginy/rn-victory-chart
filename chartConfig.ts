export interface TChartConfig {
  chartTitle: string;
  groupId: string;
  xAxisKey: { key: string; name: string };
  yAxisKey: { key: string; name: string };
  groupKey: { key: string; name: string };
  colorScale: string[];
  cropSelected: boolean; // filter bars to was selected one
}

export const chartConfig: TChartConfig = {
  chartTitle: "Program Title",
  groupId: "entity_id",
  xAxisKey: { key: "day_date", name: "Day Date" },
  yAxisKey: { key: "val", name: "Value" },
  groupKey: { key: "entity_name", name: "Entity Name" },
  colorScale: ["purple", "blue", "green", "red"],
  cropSelected: false,
};
