import React from 'react';
import { StyleSheet, View } from 'react-native';
import Chart from './src/components/Chart';
import { logdata } from './src/components/Chart/mock';

export default function App() {
  return (
    <View style={styles.container}>
      <Chart logdata={logdata} maxVisiblePoints={250} />
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
