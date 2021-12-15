import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  mainWrapper: {
    width: "100%",
    flexDirection: "row",
    borderWidth: 1,
  },
  mainChartWrapper: {
    width: "100%",
    flex: 3,
    borderWidth: 1,
    margin: 4,
  },
  legendWrapper: {
    borderWidth: 1,
    minWidth: 150,
    flex: 1,
    margin: 4,
  },
  tableWrapper: {
    flex: 1,
    width: "100%",
  },
  table: {
    flexDirection: "column",
    minHeight: "auto",
    width: "100%",
    borderWidth: 1,
  },
  row: {
    flex: 1,
    flexDirection: "row",
  },
  column: {
    flex: 1,
    backgroundColor: "#DDD",
    margin: 1,
    padding: 2,
  },
});
