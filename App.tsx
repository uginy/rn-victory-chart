import React, {useEffect} from 'react';
import {SafeAreaView, ScrollView} from 'react-native';
import {StyledWrapper} from './src/components/Chart/Styles';
import {logdata} from './src/components/Chart/mock';
import Chart from './src/components/Chart';
import * as ScreenOrientation from 'expo-screen-orientation';

export default function App() {

  async function changeScreenOrientation() {
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT);
  }

  useEffect(() => {
    changeScreenOrientation().then(() => 'Portrait Mode On')
  }, [])
  return (
    <SafeAreaView>
      <ScrollView>
        <StyledWrapper>
          <Chart logdata={logdata} maxVisiblePoints={250}/>
        </StyledWrapper>
      </ScrollView>
    </SafeAreaView>
  );
}
