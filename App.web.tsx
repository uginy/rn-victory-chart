import React, { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import GroupBarChart from "./src/components/GroupBarChart/index.web";
import { chartConfig } from "./chartConfig";
const dataJson = require("./assets/fixtures/data.json");
import { groupBy } from "lodash-es";
import { ProjectSelector } from "./src/components/GroupBarChart/ProjectSelector";
import { TimeScaleSelector } from "./src/components/GroupBarChart/TimeScaleSelector";
import { timeSliceSet } from "./src/components/GroupBarChart/helpers";

import { StyledEngineProvider } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import DateRangePicker, { DateRange } from "@mui/lab/DateRangePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import Box from "@mui/material/Box";
import dayjs from "dayjs";
import { ETimeSlice } from "./src/components/GroupBarChart/interface";

const data = JSON.parse(JSON.stringify(dataJson)).sort((a: any, b: any) =>
  new Date(a.start_date_time) > new Date(b.start_date_time) ? 1 : -1
);

const fromDate = dayjs(new Date()).subtract(3, "days").toDate();
const toDate = dayjs(new Date()).toDate();

export default function App() {
  const [project, setProject] = React.useState("all");
  const [timeSlice, setTimeSlice] = React.useState(ETimeSlice["15m"]);
  const [dateRange, setDateRange] = React.useState<DateRange<Date>>([
    fromDate,
    toDate,
  ]);

  console.log(timeSlice);
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
    <StyledEngineProvider injectFirst>
      <View style={styles.container}>
        <View style={styles.filter}>
          <ProjectSelector
            projectList={projectList}
            project={project}
            onProjectChange={(e) => setProject(e)}
          />
          <View style={styles.controls}>
            <View style={styles.timeSlice}>
              <TimeScaleSelector
                timeSliceSet={timeSliceSet}
                timeSlice={timeSlice}
                onTimeSliceChange={(e: ETimeSlice) => {
                  setTimeSlice(e);
                }}
              />
            </View>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateRangePicker
                startText="From"
                endText="To"
                value={dateRange}
                onChange={dateRangeHandler}
                renderInput={(startProps: any, endProps: any) => (
                  <React.Fragment>
                    <TextField {...startProps} />
                    <Box sx={{ mx: 2 }}> ... </Box>
                    <TextField {...endProps} />
                  </React.Fragment>
                )}
              />
            </LocalizationProvider>
          </View>
        </View>

        <GroupBarChart
          logdata={logDataMemo}
          chartConfig={chartConfig}
          timeSlice={timeSlice}
        />
      </View>
    </StyledEngineProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
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
