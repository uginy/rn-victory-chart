import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { styles } from "./styles";
import { TChartConfig } from "./interface";

type LegendComponentProps = {
  onDisplayValues: (f: Function) => void;
  defaultValues: any;
  chartConfig: TChartConfig;
};

const LegendComponent = ({
  onDisplayValues,
  defaultValues,
  chartConfig,
}: LegendComponentProps) => {
  const [activeValues, setActiveValues] = React.useState<any[]>(defaultValues);

  const updateValuesCallback = (activeValues: any | Object) => {
    setActiveValues(activeValues);
  };

  useEffect(() => {
    onDisplayValues(updateValuesCallback);
  }, []);

  console.log(activeValues);
  return (
    <View style={styles.legendWrapper}>
      <View style={styles.legendInnerWrapper}>
        <View style={styles.legendDateWrapper}>
          <Text style={styles.legendDateText}>
            {/*{dayjs(activeValues[0][chartConfig.xAxisKey.key]).format(*/}
            {/*  "DD-MM-YYYY"*/}
            {/*) || dayjs(new Date()).format("DD-MM-YYYY")}*/}
            123
          </Text>
        </View>
        {activeValues?.map((item, i) => (
          <View key={`legend-row-${i}`} style={styles.legendValuesWrapper}>
            <Text>{item[chartConfig.groupKey.key]}</Text>
            <Text>{item[chartConfig.yAxisKey.key]}</Text>
          </View>
        ))}
        <View style={styles.legendValuesTotalWrapper}>
          <Text>Total:</Text>
          <Text>
            {activeValues?.reduce((a, i) => a + i[chartConfig.yAxisKey.key], 0)}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default LegendComponent;
