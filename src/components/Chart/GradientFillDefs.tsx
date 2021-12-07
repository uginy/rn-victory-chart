import React from 'react';
import {Defs, LinearGradient, Stop} from 'react-native-svg';
import {settings} from './Settings';

const GradientFillDefs = () => {
  return (
    <>
      <Defs>
          <LinearGradient id="flow-grad" gradientTransform="rotate(90)">
            <Stop offset="0%" stopColor={settings.chartColor1} stopOpacity={settings.chartStopOpacity1}/>
            <Stop offset="50%" stopColor={settings.chartColor1} stopOpacity={settings.chartStopOpacity2}/>
            <Stop offset="100%" stopColor={settings.chartColor1} stopOpacity={settings.chartStopOpacity3}/>
          </LinearGradient>
      </Defs>
      <Defs>
        <LinearGradient id="p1-grad" gradientTransform="rotate(90)">
          <Stop offset="0%" stopColor={settings.chartColor2} stopOpacity={settings.chartStopOpacity1}/>
          <Stop offset="50%" stopColor={settings.chartColor2} stopOpacity={settings.chartStopOpacity2}/>
          <Stop offset="100%" stopColor={settings.chartColor2} stopOpacity={settings.chartStopOpacity3}/>
        </LinearGradient>
      </Defs>
      <Defs>
        <LinearGradient id="p2-grad" gradientTransform="rotate(90)">
          <Stop offset="0%" stopColor={settings.chartColor3} stopOpacity={settings.chartStopOpacity1}/>
          <Stop offset="50%" stopColor={settings.chartColor3} stopOpacity={settings.chartStopOpacity2}/>
          <Stop offset="100%" stopColor={settings.chartColor3} stopOpacity={settings.chartStopOpacity3}/>
        </LinearGradient>
      </Defs>
    </>
  );
};

export default GradientFillDefs;
