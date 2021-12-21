import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { styles } from "./styles";
import dayjs from "dayjs";

type LegendComponentProps = {
  onDisplayValues: (f: Function) => void;
  defaultValues: any;
};

const LegendComponent = ({
  onDisplayValues,
  defaultValues,
}: LegendComponentProps) => {
  const [activeValues, setActiveValues] = React.useState<any[]>(defaultValues);

  const updateValuesCallback = (activeValues: any | Object) => {
    setActiveValues(activeValues);
  };

  useEffect(() => {
    onDisplayValues(updateValuesCallback);
  }, []);

  return (
    <View style={styles.legendWrapper}>
      <View style={styles.legendInnerWrapper}>
        <View style={styles.legendDateWrapper}>
          <Text style={styles.legendDateText}>
            {dayjs(activeValues[0]?.day_date).format("DD-MM-YYYY") ||
              dayjs(new Date()).format("DD-MM-YYYY")}
          </Text>
        </View>
        {activeValues?.map((item, i) => (
          <View key={`legend-row-${i}`} style={styles.legendValuesWrapper}>
            <Text>{item.entity_name}</Text>
            <Text>{item.val}</Text>
          </View>
        ))}
        <View style={styles.legendValuesTotalWrapper}>
          <Text>Total:</Text>
          <Text>{activeValues.reduce((a, i) => a + i.val, 0)}</Text>
        </View>
      </View>
    </View>
  );
};

export default LegendComponent;
