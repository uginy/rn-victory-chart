import { TChartConfig } from "./src/components/GroupBarChart/interface";

export const chartConfig: TChartConfig = {
  chartTitle: "Program Title",
  groupId: "program_id",
  project: { key: "project_id", name: "project_name", title: "Project ID" },
  xAxisKey: { key: "start_date_time", name: "Date Time" },
  yAxisKey: { key: "amount", name: "Value" },
  groupKey: { key: "program_name", name: "Program Name" },
  colorScale: {
    1: "purple",
    2: "green",
    3: "blue",
    4: "red",
    5: "orange",
    6: "black",
    7: "silver",
    8: "teal",
  },
  cropSelected: false,
};
