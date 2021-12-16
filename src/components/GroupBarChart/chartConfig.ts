export interface TChartConfig {
  groupId: string;
  xAxisKey: { key: string; name: string };
  yAxisKey: { key: string; name: string };
  groupKey: { key: string; name: string };
  colorScale: string[];
}

export const chartConfig: TChartConfig = {
  groupId: "entity_id",
  xAxisKey: { key: "day_date", name: "Day Date" },
  yAxisKey: { key: "val", name: "Value" },
  groupKey: { key: "entity_name", name: "Entity Name" },
  colorScale: ["purple", "blue", "green", "red"],
};
