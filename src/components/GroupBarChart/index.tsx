import React, { useCallback, useState, useMemo } from "react";
import { Text, View } from "react-native";
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryLegend,
  VictoryStack,
  VictoryTheme,
  VictoryTooltip,
} from "victory-native";
import { groupBy } from "lodash";
import { settings } from "./settings";
import { styles } from "./styles";
import LegendComponent from "./Legend";
import ZoomSelector from "./ZoomSelector";
import dayjs from "dayjs";
import { abbreviateNumber } from "./helpers";

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
  const [chartSize, setChartSize] = useState<{ width: number; height: number }>(
    { width: settings.mainChartWidth, height: settings.mainChartHeight }
  );
  const [selectedDate, setSelectedDate] = React.useState("");
  const [zoomedDomain, setZoomedDomain] = React.useState<any>(null);
  const [displayValues, setDisplayValues] = React.useState<any>(
    () => (v: any) => v
  );

  const groupedData = useMemo(() => {
    return groupBy(logdata, chartConfig.xAxisKey.key);
  }, []);

  const zoomedData = useMemo(() => {
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

  const zoomSelectorChange = useCallback((domainRange) => {
    setSelectedDate("");
    setZoomedDomain(() => domainRange);
  }, []);

  const selectedBarHandler = useCallback(
    (datum: any) => {
      const date = dayjs(datum[chartConfig.xAxisKey.key]).format("YYYY-MM-DD");
      setSelectedDate(date);
      displayValues(groupedData[date]);
      if (chartConfig?.cropSelected) {
        setZoomedDomain(() => ({
          start: new Date(date),
          end: new Date(date),
        }));
      }
      return null;
    },
    [displayValues]
  );

  const zoomedTableData = useMemo(() => {
    return logdata?.filter((item: any) =>
      !selectedDate
        ? zoomedDomain
          ? new Date(item[chartConfig.xAxisKey.key]) >=
            new Date(zoomedDomain?.start)
          : true
        : item[chartConfig.xAxisKey.key] === selectedDate
    );
  }, [zoomedDomain, selectedDate]);

  const domain = useMemo(
    () => ({
      start: new Date(
        Object.keys(groupedData)[Object.keys(groupedData).length - 1]
      ),
      end: new Date(Object.keys(groupedData)[0]),
    }),
    []
  );

  const zoomedDataLast = useMemo(() => {
    const keys = Object.keys(zoomedData);
    const defaultKey = keys[0];
    return zoomedData[defaultKey];
  }, [zoomedData]);

  const maxValues = useMemo(() => {
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

  const layoutHandler = (event: any) => {
    const { width, height } = event.nativeEvent.layout;
    setChartSize({ width, height });
  };

  const isBarsMoreThan = Object.keys(zoomedData).length > 4;

  const barWidthAccessor = useMemo(() => {
    const width =
      chartSize.width -
      settings.mainChartPadding.left -
      settings.mainChartPadding.right;
    return Object.keys(zoomedData).length > 4
      ? Math.floor(width / Object.keys(zoomedData).length - 1) -
          settings.barsSpacing
      : settings.barWidth;
  }, [logdata, zoomedData]);

  const legendProps = useMemo(() => {
    const groups = Object.keys(
      groupBy(logdata, chartConfig.groupKey.name)
    ).sort();
    const names = groups.map((program) => ({ name: program }));
    const colors = groups.map(
      (program: string) => chartConfig.colorScale[program]
    );
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
        <View style={styles.mainChartWrapper} onLayout={layoutHandler}>
          <VictoryChart
            padding={settings.mainChartPadding}
            domain={{ y: [0, maxValues] }}
            theme={VictoryTheme.material}
            /*@ts-ignore*/
            domainPadding={{ ...settings.mainChartDomainPadding }}
            width={chartSize.width}
            height={chartSize.height}
          >
            <VictoryLegend
              x={settings.mainChartPadding.left}
              width={chartSize.width}
              title={chartConfig.chartTitle}
              orientation="horizontal"
              centerTitle
              style={{
                title: { fontSize: 20 },
                labels: { lineHeight: 0.4 },
              }}
              itemsPerRow={4}
              colorScale={legendProps.colors}
              data={legendProps.names}
            />
            <VictoryAxis
              label={chartConfig.yAxisKey.name}
              orientation="left"
              dependentAxis
              height={chartSize.height}
              theme={VictoryTheme.material}
              standalone={false}
              tickFormat={abbreviateNumber}
              style={{
                axisLabel: { fontSize: 16, padding: 45, fontWeight: "bold" },
                tickLabels: { fontSize: 10 },
              }}
            />
            <VictoryAxis
              label={chartConfig.xAxisKey.name}
              style={{
                axisLabel: {
                  fontSize: 16,
                  padding: isBarsMoreThan ? 60 : 30,
                  fontWeight: "bold",
                },
                tickLabels: {
                  fontSize: 10,
                  padding: isBarsMoreThan ? 27 : 5,
                  angle: isBarsMoreThan ? -90 : 0,
                  transform: isBarsMoreThan
                    ? "translate(-3,-3)"
                    : "translate(0,0)",
                },
              }}
              tickFormat={(x) => dayjs(x).format("DD-MM-YYYY")}
            />
            <VictoryAxis
              offsetY={chartSize.height - settings.mainChartPadding.top}
              tickFormat={() => ""}
            />
            <VictoryAxis
              tickFormat={() => ""}
              orientation="left"
              dependentAxis
              height={chartSize.height}
              offsetX={chartSize.width - settings.mainChartPadding.right}
              theme={VictoryTheme.material}
              standalone={false}
            />
            {Object.entries(zoomedData)
              .reverse()
              .map(([key, items], i) => (
                <VictoryStack
                  style={{ data: { cursor: "pointer" } }}
                  key={`key-${key}-${i}`}
                  colorScale={colorScaleBar}
                >
                  {(items as any[])?.map((item: any, k: number) => {
                    return (
                      <VictoryBar
                        animate={{
                          onExit: {
                            duration: 50,
                          },
                        }}
                        style={{
                          data: {
                            fillOpacity: () => {
                              return key !== selectedDate && selectedDate !== ""
                                ? 0.5
                                : 1;
                            },
                            fill: chartConfig.colorScale[item.entity_name],
                          },
                        }}
                        key={`bar-${key}-${item.entity_name}-${k}`}
                        name={`bar-${key}-${item.entity_name}-${k}`}
                        events={[
                          {
                            target: "data",
                            eventHandlers: {
                              onPress: () => {
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
                        barWidth={barWidthAccessor}
                        data={[item]}
                        x={chartConfig.xAxisKey.key}
                        y={(datum) => datum[chartConfig.yAxisKey.key] ?? 0}
                        labels={({ datum }) => {
                          return `${datum[chartConfig.groupKey.name]}: ${
                            datum[chartConfig.yAxisKey.key]
                          }`;
                        }}
                        labelComponent={
                          <VictoryTooltip
                            renderInPortal={false}
                            dy={0}
                            centerOffset={{ x: 25 }}
                          />
                        }
                      />
                    );
                  })}
                </VictoryStack>
              ))}
          </VictoryChart>
        </View>
        <LegendComponent
          chartConfig={chartConfig}
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
              <Text style={styles.column}>
                {items[chartConfig.groupKey.name]}
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
