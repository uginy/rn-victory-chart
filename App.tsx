import React from "react";
import { SafeAreaView, ScrollView } from "react-native";
import { StyledWrapper } from "./src/components/Chart/Styles";
import { logdata } from "./src/components/GroupBarChart/mock";
import GroupBarChart from "./src/components/GroupBarChart/index.web";
import { chartConfig } from "./chartConfig";
export default function App() {
  return (
    <SafeAreaView style={{ paddingTop: 40 }}>
      <ScrollView>
        <StyledWrapper>
          <GroupBarChart logdata={logdata} chartConfig={chartConfig} />
        </StyledWrapper>
      </ScrollView>
    </SafeAreaView>
  );
}
