import React from 'react';
import {SafeAreaView, ScrollView} from 'react-native';
import {StyledWrapper} from './src/components/Chart/Styles';
import {logdata} from './src/components/Chart/mock';
import Chart from './src/components/Chart';

export default function App() {

  return (
    <SafeAreaView style={{paddingTop: 40}}>
      <ScrollView>
        <StyledWrapper>
          <Chart logdata={logdata} maxVisiblePoints={250}/>
        </StyledWrapper>
      </ScrollView>
    </SafeAreaView>
  );
}
