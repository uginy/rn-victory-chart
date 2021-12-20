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
    marginTop: 100,
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
