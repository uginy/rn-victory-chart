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
import { groupBy, sortBy } from "lodash";
import { settings } from "./settings.web";
import { styles } from "./styles.web";
import ZoomSelector from "./ZoomSelector";
import dayjs from "dayjs";
import { abbreviateNumber, colorGenerator, groupByTimeSlice } from "./helpers";

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

  const selectedBarHandler = useCallback((datum: any) => {
    let fixedDate = datum.xName.replaceAll(/T([0-9]{1}):/g, "T0$1:");
    fixedDate = fixedDate.replaceAll(/:([0-9]{1}):/g, ":0$1:");
    setSelectedDate(fixedDate);
    return null;
  }, []);

  const zoomedTableData = useMemo(() => {
    if (!selectedDate) {
      return logdata?.filter((item: any) => {
        return zoomedDomain
          ? new Date(item[chartConfig.xAxisKey.key]) >=
              new Date(zoomedDomain?.start)
          : true;
      });
    }

    return sortBy(zoomedData[selectedDate], chartConfig.xAxisKey.key);
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
    const grouped: any = groupBy(logdata, chartConfig.groupKey.key);

    const colorMapped: any = {};
    Object.entries(grouped).forEach(([el, items]: any, i: number) => {
      colorMapped[el] = {
        name: items[0][chartConfig.groupKey.name],
        color: chartConfig.colorScale[i + 1] ?? colorGenerator()[i + 1].color,
      };
    });
    const colors = Object.keys(colorMapped).map(
      (el: any) => colorMapped[el].color
    );
    const names = Object.keys(colorMapped).map((el: any) => ({
      name: colorMapped[el].name,
    }));

    return { names, colors, colorMapped };
  }, [zoomedTableData]);

  const colorScaleBar = useMemo(() => {
    return legendProps.colors;
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
              itemsPerRow={6}
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
                tickLabels: {
                  angle: "-45",
                  textAnchor: "end",
                  fontSize: 8,
                  padding: 4,
                },
                axisLabel: { fontSize: 16, padding: 70, fontWeight: "bold" },
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
                            fillOpacity: () =>
                              key !== selectedDate && selectedDate !== ""
                                ? 0.5
                                : 1,
                            fill: legendProps.colorMapped[
                              item[chartConfig.groupKey.key]
                            ].color,
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
                        barWidth={
                          Object.keys(zoomedData).length > 10
                            ? Math.floor(
                                (settings.mainChartWidth -
                                  settings.mainChartPadding.left -
                                  settings.mainChartPadding.right) /
                                  Object.keys(zoomedData).length
                              ) - settings.barsSpacing
                            : settings.barWidth
                        }
                        alignment="middle"
                        data={[item]}
                        x={() => key}
                        y={(datum) => datum[chartConfig.yAxisKey.key] ?? 0}
                        labels={({ datum }) => {
                          return `${datum[chartConfig.groupKey.name]}: ${
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
