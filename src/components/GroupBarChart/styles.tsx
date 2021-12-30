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
  legendInnerWrapper: {
    borderWidth: 0.5,
    borderColor: "#91A3AE",
    padding: 2,
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
  rowHeader: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    textAlign: "center",
  },
  columnHeader: {
    flex: 1,
    backgroundColor: "#a7b99f",
    margin: 1,
    padding: 2,
    textAlign: "center",
  },
  column: {
    flex: 1,
    backgroundColor: "#e4e4e4",
    borderRadius: 4,
    margin: 1,
    padding: 5,
    textAlign: "center",
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
    marginVertical: 2,
    padding: 3,
    flexDirection: "row",
    fontSize: 15,
    justifyContent: "space-between",
  },
  legendValuesTotalWrapper: {
    borderWidth: 1,
    borderColor: "lightgrey",
    backgroundColor: "#b2ffae",
    marginTop: 2,
    padding: 3,
    flexDirection: "row",
    fontSize: 17,
    justifyContent: "space-between",
  },
});
