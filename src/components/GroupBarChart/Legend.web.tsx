import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { styles } from "./styles.web";

type LegendComponentProps = {
  onDisplayValues: (f: Function) => void;
};

const LegendComponent = ({ onDisplayValues }: LegendComponentProps) => {
  const [activeValues, setActiveValues] = React.useState<any[]>([]);

  const updateValuesCallback = (activeValues: any | Object) => {
    setActiveValues(activeValues);
  };

  useEffect(() => {
    onDisplayValues(updateValuesCallback);
  }, []);

  return (
    <View style={styles.legendWrapper}>
      <View>
        <Text>{activeValues[0]?.day_date}</Text>
      </View>
      {activeValues?.map((item) => (
        <View>
          <Text>{item.entity_name}</Text>
          <Text>{item.val}</Text>
        </View>
      ))}
    </View>
  );
};

export default LegendComponent;
