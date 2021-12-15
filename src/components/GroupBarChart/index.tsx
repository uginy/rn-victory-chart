import React, { useEffect } from "react";
import { View, Text } from "react-native";

interface ChartProps {
  logdata: any;
  maxVisiblePoints: number;
}

export default function Chart({ logdata }: ChartProps) {
  useEffect(() => {}, [logdata]);

  return (
    <View>
      <Text>123</Text>
    </View>
  );
}
