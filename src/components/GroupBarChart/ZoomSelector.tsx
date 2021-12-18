import React from "react";
import { Button, View } from "react-native";
import { styles } from "./styles.web";
import dayjs from "dayjs";

const dateRangeAction = (domain: DateDomain, shortKey: string) => {
  switch (shortKey) {
    case "1d":
      return dayjs(domain.end).subtract(1, "day").toDate();
    case "2d":
      return dayjs(domain.end).subtract(2, "day").toDate();
    case "7d":
      return dayjs(domain.end).subtract(7, "day").toDate();
    case "1m":
      return dayjs(domain.end).subtract(1, "month").toDate();
    case "3m":
      return dayjs(domain.end).subtract(3, "month").toDate();
    case "6m":
      return dayjs(domain.end).subtract(6, "month").toDate();
    case "1y":
      return dayjs(domain.end).subtract(1, "year").toDate();
    case "all":
      return domain.start;
  }
  return domain.start;
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
