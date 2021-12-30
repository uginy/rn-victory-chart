import React, { useCallback } from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import GroupBarChart from "./src/components/GroupBarChart/index";
import { chartConfig } from "./chartConfig";
import { ETimeSlice } from "./src/components/GroupBarChart/interface";
import dayjs from "dayjs";
const dataJson = require("./assets/fixtures/data.json");
import { groupBy } from "lodash-es";
import { DateRange } from "@mui/lab/DateRangePicker";

const data = JSON.parse(JSON.stringify(dataJson)).sort((a: any, b: any) =>
  new Date(a.start_date_time) > new Date(b.start_date_time) ? 1 : -1
);

const fromDate = dayjs(new Date()).subtract(4, "days").toDate();
const toDate = dayjs(new Date()).toDate();

export default function App() {
  const [project, setProject] = React.useState("all");
  const [timeSlice, setTimeSlice] = React.useState(ETimeSlice["15m"]);
  const [dateRange, setDateRange] = React.useState<DateRange<Date>>([
    fromDate,
    toDate,
  ]);

  const logDataMemo = React.useMemo(() => {
    if (project !== "" && project !== "all") {
      return data.filter((pr: any) => pr.project_id === project);
    }
    if (dateRange[0] !== fromDate) {
      return data.filter((pr: any) => {
        const startDate = dateRange[0] ?? fromDate;
        const endDate = dateRange[1] ?? toDate;
        const currentDate = new Date(pr?.start_date_time);
        return startDate <= currentDate && currentDate <= endDate;
      });
    }
    console.log(data.length);
    return data;
  }, [project, data, timeSlice, dateRange]);

  const projectList = React.useMemo(() => {
    return Object.entries(groupBy(data, chartConfig.project.key)).map(
      ([id, items]: any) => ({
        id,
        name: items[0].project_name,
      })
    );
  }, []);

  const dateRangeHandler = useCallback((value: any) => {
    if (value[1] !== null) {
      setDateRange(value);
    }
  }, []);

  return (
    <SafeAreaView>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <GroupBarChart
            logdata={logDataMemo}
            chartConfig={chartConfig}
            timeSlice={ETimeSlice["1h"]}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: { height: "100%" },
  container: {
    flexDirection: "column",
    backgroundColor: "#fff",
    padding: 5,
    flex: 1,
    height: "100%",
  },
  filter: {
    width: "100%",
    backgroundColor: "#f1f1f1",
    flexDirection: "row",
    padding: 16,
    justifyContent: "space-around",
  },
  controls: {
    flexDirection: "row",
  },
  timeSlice: {
    paddingHorizontal: 28,
  },
});
