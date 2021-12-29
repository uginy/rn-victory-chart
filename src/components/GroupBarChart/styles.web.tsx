import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  mainWrapper: {
    width: "100%",
    flexDirection: "row",
  },
  mainChartWrapper: {
    width: "100%",
    flex: 3,
    margin: 4,
  },
  legendWrapper: {
    minWidth: 150,
    margin: 4,
    marginTop: 81,
    flex: 0,
  },
  legendInnerWrapper: {
    borderWidth: 2,
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
    borderWidth: 1,
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
    backgroundColor: "#eeeeee",
    margin: 1,
    padding: 2,
    textAlign: "center",
  },
  zoomSelectorWrapper: {
    flex: 1,
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
  },
  zoomSelectorButtonWrapper: {
    borderRadius: 0,
    borderColor: "#000",
    margin: 3,
    color: "#444",
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
