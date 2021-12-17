import React from "react";
import { Button, View } from "react-native";
import { subDays, subMonths, subYears } from "date-fns";
import { styles } from "./styles.web";

const dateRangeAction = (domain: DateDomain, shortKey: string) => {
  switch (shortKey) {
    case "1d":
      return subDays(domain.end, 1);
    case "2d":
      return subDays(domain.end, 2);
    case "7d":
      return subDays(domain.end, 7);
    case "1m":
      return subMonths(domain.end, 1);
    case "3m":
      return subMonths(domain.end, 3);
    case "6m":
      return subMonths(domain.end, 6);
    case "1y":
      return subYears(domain.end, 1);
    case "all":
      return domain.start;
    default:
      return domain.start;
  }
};

const daysMap: DateMap[] = [
  { key: "1d", name: "1d" },
  { key: "2d", name: "2d" },
  { key: "7d", name: "7d" },
  { key: "1m", name: "1m" },
  { key: "3m", name: "3m" },
  { key: "6m", name: "6m" },
  { key: "1y", name: "1y" },
  { key: "all", name: "All" },
];

type DateMap = {
  key: string;
  name: string;
};

type ZoomSelectorProps = {
  dataDomain: DateDomain;
  onDateRangeChange: (domain: DateDomain) => void;
};

type DateDomain = {
  start: Date;
  end: Date;
};

const ZoomSelector = ({ dataDomain, onDateRangeChange }: ZoomSelectorProps) => {
  const [selected, setSelected] = React.useState("all");

  const daysHandler = (key: string) => {
    const isDateInRange = dateRangeAction(dataDomain, key) >= dataDomain.start;
    setSelected(key);
    setTimeout(() => {
      onDateRangeChange({
        start: isDateInRange
          ? dateRangeAction(dataDomain, key)
          : dataDomain.start,
        end: dataDomain.end,
      });
    }, 0);
  };
  return (
    <View style={styles.zoomSelectorWrapper}>
      {daysMap.map((dayItem, i) => {
        return (
          <View
            key={i}
            style={{
              margin: 3,
              borderWidth: selected === dayItem.key ? 1 : 0,
              borderRadius: 3,
              borderColor: "black",
            }}
          >
            <Button
              color={"grey"}
              onPress={() => daysHandler(dayItem.key)}
              title={dayItem.name}
            />
          </View>
        );
      })}
    </View>
  );
};

export default ZoomSelector;
