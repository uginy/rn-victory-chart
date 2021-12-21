import { TChartConfig } from "./src/components/GroupBarChart/interface";

export const chartConfig: TChartConfig = {
  chartTitle: "Program Title",
  groupId: "entity_id",
  xAxisKey: { key: "day_date", name: "Day Date" },
  yAxisKey: { key: "val", name: "Value" },
  groupKey: { key: "entity_name", name: "Entity Name" },
  colorScale: {
    "Valve 1": "purple",
    "Valve 2": "green",
    "Valve 3": "blue",
    "Valve 4": "red",
    "Valve 5": "orange",
  },
  cropSelected: false,
};
