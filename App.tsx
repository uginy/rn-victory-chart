import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { logdata } from "./src/components/GroupBarChart/mock";
import GroupBarChart from "./src/components/GroupBarChart/index";
import { chartConfig } from "./chartConfig";

export default function App() {
  return (
    <SafeAreaView>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <GroupBarChart logdata={logdata} chartConfig={chartConfig} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: { height: "100%" },
  container: {
    flexDirection: "column",
    backgroundColor: "#fff",
    padding: 5,
    flex: 1,
    height: "100%",
  },
});
