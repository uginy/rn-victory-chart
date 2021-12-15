import React from 'react';
import { StyleSheet, View } from 'react-native';
import { logdata } from './src/components/GroupBarChart/mock';
import GroupBarChart from './src/components/GroupBarChart/index.web';
import {chartConfig} from './src/components/GroupBarChart/chartConfig';

export default function App() {
  return (
    <View style={styles.container}>
      <GroupBarChart logdata={logdata} chartConfig={chartConfig}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: '1rem',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
