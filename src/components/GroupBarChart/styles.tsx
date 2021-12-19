import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  mainWrapper: {
    flexDirection: "column",
  },
  mainChartWrapper: {
    width: "100%",
    margin: 4,
  },
  legendWrapper: {
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
  },
  row: {
    flex: 1,
    flexDirection: "row",
  },
  column: {
    flex: 1,
    backgroundColor: "#d4fbf8",
    margin: 1,
    padding: 5,
  },
  zoomSelectorWrapper: {
    flex: 1,
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
  },
  zoomSelectorButtonWrapper: {
    borderRadius: 3,
    margin: 3,
    backgroundColor: "#EEE",
  },
  legendDateWrapper: {
    backgroundColor: "lightgrey",
    padding: 2,
  },
  legendDateText: {
    fontSize: 20,
  },
  legendValuesWrapper: {
    borderWidth: 1,
    borderColor: "lightgrey",
    backgroundColor: "#e7e7e7",
    margin: 2,
    padding: 3,
    flexDirection: "row",
    fontSize: 15,
    justifyContent: "space-between",
  },
  legendValuesTotalWrapper: {
    borderWidth: 1,
    borderColor: "lightgrey",
    backgroundColor: "#b2ffae",
    margin: 2,
    padding: 3,
    flexDirection: "row",
    fontSize: 17,
    justifyContent: "space-between",
  },
});
