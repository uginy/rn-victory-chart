import React, { useCallback } from "react";
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
import { settings } from "./settings";
import { styles } from "./styles.web";
import LegendComponent from "./Legend.web";
import ZoomSelector from "./ZoomSelector";
import dayjs from "dayjs";

interface ChartProps {
  logdata: any;
  chartConfig: any;
}

export default function GroupBarChart({ logdata, chartConfig }: ChartProps) {
  logdata = logdata.map((data: any) => ({
    ...data,
    [chartConfig.xAxisKey.key]: data[chartConfig.xAxisKey.key]
      .split("/")
      .reverse()
      .join("-"),
  }));
  const [selectedDate, setSelectedDate] = React.useState("");
  const [zoomedDomain, setZoomedDomain] = React.useState<any>(null);
  const [displayValues, setDisplayValues] = React.useState<any>(
    () => (v: any) => v
  );

  const groupedData = React.useMemo(() => {
    return groupBy(logdata, chartConfig.xAxisKey.key);
  }, []);

  const zoomedData = React.useMemo(() => {
    let grouped = groupBy(logdata, chartConfig.xAxisKey.key);
    if (zoomedDomain) {
      const resultZoomed: any = {};
      for (const date in grouped) {
        const startDate = new Date(zoomedDomain.start);
        const endDate = new Date(zoomedDomain?.end) || domain.end;
        const currentDate = new Date(date);
        if (startDate <= currentDate && currentDate <= endDate) {
          resultZoomed[date] = grouped[date];
        }
      }
      return resultZoomed;
    }
    if (selectedDate !== "") {
      const result: any = {};
      result[selectedDate] = grouped[selectedDate];
      return result;
    }
    return grouped;
  }, [zoomedDomain]);

  const zoomSelectorChange = React.useCallback((domainRange) => {
    setSelectedDate("");
    setZoomedDomain(() => domainRange);
  }, []);

  const selectedBarHandler = useCallback(
    (datum: any) => {
      const date = datum[chartConfig.xAxisKey.key];
      setSelectedDate(date);
      if (chartConfig?.cropSelected) {
        setZoomedDomain(() => ({
          end: new Date(date),
          start: new Date(date),
        }));
      }
      displayValues(groupedData[date]);
      return null;
    },
    [displayValues]
  );

  const zoomedTableData = React.useMemo(() => {
    return logdata?.filter((item: any) =>
      !selectedDate
        ? zoomedDomain
          ? new Date(item[chartConfig.xAxisKey.key]) >=
            new Date(zoomedDomain?.start)
          : true
        : item[chartConfig.xAxisKey.key] === selectedDate
    );
  }, [zoomedDomain]);

  const domain = React.useMemo(
    () => ({
      start: new Date(
        Object.keys(groupedData)[Object.keys(groupedData).length - 1]
      ),
      end: new Date(Object.keys(groupedData)[0]),
    }),
    []
  );

  const zoomedDataLast = React.useMemo(() => {
    const keys = Object.keys(zoomedData);
    const defaultKey = keys[0];
    return zoomedData[defaultKey];
  }, [zoomedData]);

  const maxValues = React.useMemo(() => {
    const max: any = [];
    for (const item in zoomedData) {
      max.push(
        groupedData[item].reduce(
          (acc, item) => acc + (item as any)[chartConfig.yAxisKey.key],
          0
        )
      );
    }
    return Math.max(...max);
  }, [zoomedData]);

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
              x={settings.mainChartWidth / 2 - settings.mainChartPadding.right}
              width={settings.mainChartWidth}
              title={chartConfig.chartTitle}
              centerTitle
              orientation="horizontal"
              style={{ title: { fontSize: 20 } }}
              data={[]}
            />
            <VictoryAxis
              label={chartConfig.yAxisKey.name}
              orientation="left"
              dependentAxis
              height={settings.mainChartHeight}
              theme={VictoryTheme.material}
              standalone={false}
              style={{
                axisLabel: { fontSize: 16, padding: 70, fontWeight: "bold" },
              }}
            />
            <VictoryAxis
              label={chartConfig.xAxisKey.name}
              style={{
                axisLabel: { fontSize: 16, padding: 30, fontWeight: "bold" },
              }}
              tickFormat={(x) => dayjs(x).format("DD-MM-YYYY")}
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
            {Object.entries(zoomedData)
              .reverse()
              .map(([key, items], i) => (
                <VictoryStack
                  style={{ data: { cursor: "pointer" } }}
                  key={`key-${key}-${i}`}
                  colorScale={chartConfig.colorScale}
                >
                  {(items as any[])?.map((item: any, k: number) => {
                    return (
                      <VictoryBar
                        key={`bar-${key}-${item.entity_name}-${k}`}
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
                        barWidth={40}
                        data={[item]}
                        x={chartConfig.xAxisKey.key}
                        y={(datum) => datum[chartConfig.yAxisKey.key] ?? 0}
                        labels={({ datum }) => {
                          return `${datum[chartConfig.groupKey.key]}: ${
                            datum[chartConfig.yAxisKey.key]
                          }`;
                        }}
                        labelComponent={
                          <VictoryTooltip dy={0} centerOffset={{ x: 25 }} />
                        }
                      />
                    );
                  })}
                </VictoryStack>
              ))}
          </VictoryChart>
        </View>
        <LegendComponent
          defaultValues={zoomedDataLast}
          onDisplayValues={(f) => setDisplayValues(() => f)}
        />
      </View>
      <View>
        <ZoomSelector
          dataDomain={domain}
          onDateRangeChange={zoomSelectorChange}
        />
      </View>

      <View style={styles.tableWrapper}>
        <View style={styles.table}>
          {zoomedTableData?.map((items: any, i: number) => (
            <View key={`legend-${i}`} style={styles.row}>
              <Text style={styles.column}>
                {items[chartConfig.xAxisKey.key]}
              </Text>
              <Text style={styles.column}>{items[chartConfig.groupId]}</Text>
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
