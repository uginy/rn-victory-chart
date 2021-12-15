import React, { useEffect, useMemo } from "react";
import { Text, View } from "react-native";
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryStack,
  VictoryTheme,
  VictoryTooltip,
} from "victory";
import { groupBy, sortBy } from "lodash";
import { chartConfig } from "./chartConfig";
import { settings } from "./settings";
import { styles } from "./styles.web";
import LegendComponent from "./Legend.web";
import ZoomSelector from "./ZoomSelector";

interface ChartProps {
  logdata: any;
  chartConfig: any;
}

export default function GroupBarChart({ logdata }: ChartProps) {
  const groupedData = groupBy(logdata, chartConfig.xAxisKey.key);
  const [selectedDate, setSelectedDate] = React.useState("");
  const dataSorted = sortBy(
    Object.entries(groupedData),
    chartConfig.xAxisKey.key
  ).reverse();
  const [displayValues, setDisplayValues] = React.useState<any>(
    () => (v: any) => v
  );
  const maxValues = useMemo(() => {
    const max = [];
    for (const item in groupedData) {
      max.push(
        groupedData[item].reduce(
          (acc, item) => acc + item[chartConfig.yAxisKey.key],
          0
        )
      );
    }
    return max.sort()[0];
  }, [groupedData]);

  useEffect(() => {
    console.log(dataSorted);
  }, [logdata]);

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
            <VictoryAxis
              orientation="left"
              dependentAxis
              height={settings.mainChartHeight}
              theme={VictoryTheme.material}
              standalone={false}
            />
            <VictoryAxis tickFormat={(x) => x} />
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
            {dataSorted.map(([key, items], i) => (
              <VictoryStack colorScale={chartConfig.colorScale}>
                {items.map((item, k) => (
                  <VictoryBar
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
                                  const date = datum[chartConfig.xAxisKey.key];
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
                    key={`${i}-${k}`}
                    data={[item]}
                    x={chartConfig.xAxisKey.key}
                    y={chartConfig.yAxisKey.key}
                    labels={({ datum }) => {
                      return `${datum[chartConfig.yAxisKey.name]}: ${
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
          dataDomain={{
            start: new Date(selectedDate),
            end: new Date(),
          }}
          onDateRangeChange={(domain) => {
            console.log(domain);
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
            .map((items: any) => (
              <View style={styles.row}>
                <Text style={styles.column}>
                  {items[chartConfig.xAxisKey.key]}
                </Text>
                <Text style={styles.column}>{items[chartConfig.groupId]}</Text>
                <Text style={styles.column}>
                  {items[chartConfig.yAxisKey.name]}
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
