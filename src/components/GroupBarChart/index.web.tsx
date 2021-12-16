import React, { useMemo } from "react";
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
import { chartConfig } from "./chartConfig";
import { settings } from "./settings";
import { styles } from "./styles.web";
import LegendComponent from "./Legend.web";
import ZoomSelector from "./ZoomSelector";
import dayjs from "dayjs";

interface ChartProps {
  logdata: any;
  chartConfig: any;
}

export default function GroupBarChart({ logdata }: ChartProps) {
  logdata = logdata.map((data: any) => {
    const dateParsed = data[chartConfig.xAxisKey.key]
      .split("/")
      .reverse()
      .join("-");
    return {
      ...data,
      [chartConfig.xAxisKey.key]: dateParsed,
    };
  });
  const [selectedDate, setSelectedDate] = React.useState("");
  const [zoomedDomain, setZoomedDomain] = React.useState<any>(null);

  const groupedData = useMemo(() => {
    return groupBy(logdata, chartConfig.xAxisKey.key);
  }, []);

  const zoomedData = useMemo(() => {
    let grouped = groupBy(logdata, chartConfig.xAxisKey.key);
    if (zoomedDomain) {
      const resultZoomed: any = {};
      for (const date in grouped) {
        const startDate = new Date(zoomedDomain.start);
        const currentDate = new Date(date);
        if (currentDate >= startDate) {
          resultZoomed[date] = grouped[date];
        }
      }
      return resultZoomed;
    }
    return grouped;
  }, [zoomedDomain]);

  const domain = {
    start: new Date(
      Object.keys(groupedData)[Object.keys(groupedData).length - 1]
    ),
    end: new Date(Object.keys(groupedData)[0]),
  };
  const [displayValues, setDisplayValues] = React.useState<any>(
    () => (v: any) => v
  );
  const maxValues = useMemo(() => {
    const max = [];
    for (const item in zoomedData) {
      max.push(
        groupedData[item].reduce(
          (acc, item) => acc + item[chartConfig.yAxisKey.key],
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
              y={10}
              x={settings.mainChartWidth / 2 - settings.mainChartPadding.right}
              width={settings.mainChartWidth}
              title="Programs Title"
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
                  {(items as [])?.map((item: any, k: number) => (
                    <VictoryBar
                      key={`bar-${key}-${k}`}
                      events={[
                        {
                          target: "data",
                          eventHandlers: {
                            onClick: () => {
                              return [
                                {
                                  target: "labels",
                                  mutation: ({ datum }) => {
                                    // console.log(
                                    //   "DATE",
                                    //   datum[chartConfig.xAxisKey.key]
                                    // );
                                    // console.log(
                                    //   groupedData[datum[chartConfig.xAxisKey.key]]
                                    // );
                                    const date =
                                      datum[chartConfig.xAxisKey.key];
                                    setSelectedDate(() => date);
                                    displayValues(groupedData[date]);
                                    return null;
                                  },
                                },
                              ];
                            },
                          },
                        },
                      ]}
                      barWidth={40}
                      data={[item]}
                      x={chartConfig.xAxisKey.key}
                      y={chartConfig.yAxisKey.key}
                      labels={({ datum }) => {
                        return `${datum[chartConfig.groupKey.key]}: ${
                          datum[chartConfig.yAxisKey.key]
                        }`;
                      }}
                      labelComponent={
                        <VictoryTooltip dy={0} centerOffset={{ x: 25 }} />
                      }
                    />
                  ))}
                </VictoryStack>
              ))}
          </VictoryChart>
        </View>
        <LegendComponent onDisplayValues={(f) => setDisplayValues(() => f)} />
      </View>
      <View>
        <ZoomSelector
          dataDomain={domain}
          onDateRangeChange={(domain) => {
            setZoomedDomain(domain);
          }}
        />
      </View>

      <View style={styles.tableWrapper}>
        <View style={styles.table}>
          {logdata
            ?.filter((item: any) =>
              !selectedDate
                ? true
                : item[chartConfig.xAxisKey.key] === selectedDate
            )
            .map((items: any, i: number) => (
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
