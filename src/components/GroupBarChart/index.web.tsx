import React, { useCallback, useMemo } from "react";
import { Text, View } from "react-native";
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryLegend,
  VictoryStack,
  VictoryTheme,
  VictoryTooltip,
} from "victory";
import { groupBy } from "lodash";
import { settings } from "./settings.web";
import { styles } from "./styles.web";
import ZoomSelector from "./ZoomSelector";
import dayjs from "dayjs";
import { abbreviateNumber, groupByTimeSlice } from "./helpers";

interface ChartProps {
  logdata: any;
  chartConfig: any;
  timeSlice: string;
}

export default function GroupBarChart({
  logdata,
  chartConfig,
  timeSlice,
}: ChartProps) {
  const [selectedDate, setSelectedDate] = React.useState("");
  const [zoomedDomain, setZoomedDomain] = React.useState<any>(null);
  const [displayValues, setDisplayValues] = React.useState<any>(
    () => (v: any) => v
  );

  const groupedData = useMemo(() => {
    return groupByTimeSlice(logdata, chartConfig, timeSlice);
  }, [logdata, timeSlice]);

  const zoomedData = useMemo(() => {
    if (zoomedDomain) {
      const resultZoomed: any = {};
      for (const date in groupedData) {
        const startDate = new Date(zoomedDomain.start);
        const endDate = new Date(zoomedDomain?.end) || domain.end;
        const currentDate = new Date(date);
        if (startDate <= currentDate && currentDate <= endDate) {
          resultZoomed[date] = groupedData[date];
        }
      }
      return resultZoomed;
    }
    return groupedData;
  }, [zoomedDomain, logdata, timeSlice]);

  const zoomSelectorChange = useCallback((domainRange) => {
    setSelectedDate("");
    setZoomedDomain(() => domainRange);
  }, []);

  const selectedBarHandler = useCallback(
    (datum: any) => {
      const date = dayjs(datum[chartConfig.xAxisKey.key]).format(
        "YYYY-MM-DD HH:mm"
      );
      setSelectedDate(date);

      console.log(date);
      console.log(zoomedData);
      // displayValues(groupedData[date]);
      // if (chartConfig?.cropSelected) {
      //   setZoomedDomain(() => ({
      //     end: new Date(date),
      //     start: new Date(date),
      //   }));
      // }
      return null;
    },
    [displayValues]
  );

  const zoomedTableData = useMemo(() => {
    if (!selectedDate) {
      return logdata?.filter((item: any) => {
        return zoomedDomain
          ? new Date(item[chartConfig.xAxisKey.key]) >=
              new Date(zoomedDomain?.start)
          : true;
      });
    }
    return zoomedData[selectedDate];
  }, [zoomedDomain, selectedDate, logdata]);

  const domain = useMemo(
    () => ({
      start: new Date(Object.keys(groupedData)[0]),
      end: new Date(
        Object.keys(groupedData)[Object.keys(groupedData).length - 1]
      ),
    }),
    []
  );

  // const zoomedDataLast = useMemo(() => {
  //   const keys = Object.keys(zoomedData);
  //   const defaultKey = keys[keys.length - 1];
  //   return zoomedData[defaultKey];
  // }, [zoomedData]);

  const maxValues = useMemo(() => {
    const max: any = [];
    for (const item in zoomedData) {
      if (zoomedData.hasOwnProperty(item)) {
        max.push(
          groupedData[item].reduce(
            (acc: any, item: any) =>
              acc + (item as any)[chartConfig.yAxisKey.key],
            0
          )
        );
      }
    }

    return Math.max(...max) > 0 ? Math.max(...max) : 1;
  }, [zoomedData]);

  const legendProps = useMemo(() => {
    const groups = Object.keys(
      groupBy(logdata, chartConfig.groupKey.key)
    ).sort();
    const names = groups.map((program) => ({ name: program }));
    const colors = groups.map((_, i: number) => chartConfig.colorScale[i]);

    return { names, colors };
  }, [zoomedTableData]);

  const colorScaleBar = useMemo(() => {
    return Object.keys(chartConfig.colorScale).map(
      (color) => chartConfig.colorScale[color]
    );
  }, []);

  return (
    <>
      <View style={styles.mainWrapper}>
        <View style={styles.mainChartWrapper}>
          <VictoryChart
            padding={settings.mainChartPadding}
            domain={{ y: [0, maxValues] }}
            theme={VictoryTheme.material}
            /*@ts-ignore*/
            domainPadding={settings.mainChartDomainPadding}
            width={settings.mainChartWidth}
            height={settings.mainChartHeight}
          >
            <VictoryLegend
              x={settings.mainChartPadding.left}
              width={settings.mainChartWidth}
              title={chartConfig.chartTitle}
              orientation="horizontal"
              centerTitle
              style={{
                title: { fontSize: 20 },
                labels: { lineHeight: 0.4 },
              }}
              itemsPerRow={8}
              colorScale={legendProps.colors}
              data={legendProps.names}
            />
            <VictoryAxis
              label={chartConfig.yAxisKey.name}
              orientation="left"
              dependentAxis
              height={settings.mainChartHeight}
              theme={VictoryTheme.material}
              standalone={false}
              tickFormat={abbreviateNumber}
              style={{
                axisLabel: { fontSize: 16, padding: 50, fontWeight: "bold" },
              }}
            />
            <VictoryAxis
              label={chartConfig.xAxisKey.name}
              style={{
                tickLabels: { angle: "-45", textAnchor: "end", fontSize: 8 },
                axisLabel: { fontSize: 16, padding: 90, fontWeight: "bold" },
              }}
              tickFormat={(x) => {
                if (timeSlice === "15min" || timeSlice === "1hour") {
                  return dayjs(x).format("DD-MM-YYYY HH:mm");
                }
                return dayjs(x).format("DD-MM-YYYY");
              }}
              tickValues={Object.keys(zoomedData).map((el) => new Date(el))}
            />
            <VictoryAxis
              offsetY={settings.mainChartHeight - settings.mainChartPadding.top}
              tickFormat={() => ""}
            />
            <VictoryAxis
              tickFormat={() => ""}
              orientation="left"
              dependentAxis
              height={settings.mainChartHeight}
              offsetX={
                settings.mainChartWidth - settings.mainChartPadding.right
              }
              theme={VictoryTheme.material}
              standalone={false}
            />
            {Object.entries(zoomedData).map(([key, items], i) => {
              return (
                <VictoryStack
                  style={{ data: { cursor: "pointer" } }}
                  key={`key-${key}-${i}`}
                  animate={{ duration: 50 }}
                  colorScale={colorScaleBar}
                >
                  {(items as any[])?.map((item: any, k: number) => {
                    return (
                      <VictoryBar
                        style={{
                          data: {
                            fillOpacity: () => {
                              return key !== selectedDate && selectedDate !== ""
                                ? 0.5
                                : 1;
                            },
                            fill: chartConfig.colorScale[
                              item[chartConfig.groupKey.key]
                            ],
                          },
                        }}
                        key={`bar-${key}-${
                          item[chartConfig.groupKey.key]
                        }-${k}`}
                        events={[
                          {
                            target: "data",
                            eventHandlers: {
                              onClick: () => {
                                return [
                                  {
                                    target: "labels",
                                    mutation: ({ datum }) =>
                                      selectedBarHandler(datum),
                                  },
                                ];
                              },
                            },
                          },
                        ]}
                        barRatio={1}
                        alignment="middle"
                        data={[item]}
                        x={() => key}
                        y={(datum) => datum[chartConfig.yAxisKey.key] ?? 0}
                        labels={({ datum }) => {
                          return `${datum[chartConfig.groupKey.key]}: ${
                            datum[chartConfig.yAxisKey.key]
                          }`;
                        }}
                        labelComponent={
                          <VictoryTooltip
                            dy={0}
                            renderInPortal={true}
                            centerOffset={{ x: 0 }}
                          />
                        }
                      />
                    );
                  })}
                </VictoryStack>
              );
            })}
          </VictoryChart>
        </View>
        {/*<LegendComponent*/}
        {/*  chartConfig={chartConfig}*/}
        {/*  defaultValues={zoomedDataLast}*/}
        {/*  onDisplayValues={(f) => setDisplayValues(() => f)}*/}
        {/*/>*/}
      </View>
      <View>
        <ZoomSelector
          dataDomain={domain}
          onDateRangeChange={zoomSelectorChange}
        />
      </View>

      <View style={styles.tableWrapper}>
        <View style={styles.table}>
          <View style={styles.rowHeader}>
            <Text style={styles.columnHeader}>{chartConfig.xAxisKey.name}</Text>
            <Text style={styles.columnHeader}>ProjectID</Text>
            <Text style={styles.columnHeader}>ProjectName</Text>
            <Text style={styles.columnHeader}>ProgramName</Text>
            <Text style={styles.columnHeader}>Amount</Text>
          </View>
          {zoomedTableData?.map((items: any, i: number) => (
            <View key={`legend-${i}`} style={styles.row}>
              <Text style={styles.column}>
                {dayjs(items[chartConfig.xAxisKey.key]).format(
                  "YYYY-MM-DD HH:mm"
                )}
              </Text>
              <Text style={styles.column}>{items["project_id"]}</Text>
              <Text style={styles.column}>{items["project_name"]}</Text>
              <Text style={styles.column}>
                {items[chartConfig.groupKey.key]}
              </Text>
              <Text style={styles.column}>
                {items[chartConfig.yAxisKey.key]}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </>
  );
}
