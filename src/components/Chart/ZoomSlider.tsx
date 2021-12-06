import {StyleSheet, Text, View} from 'react-native';
import {Slider} from '@miblanchard/react-native-slider';
import React, {FC, RefObject} from 'react';

const zoomMinLevel = 1;
const zoomMaxLevel = 10;
const zoomStep = 1;

interface Props {
  zoomLevel: RefObject<number>;
  handleScaleX: () => void;
}

export const ZoomSlider: FC<Props> = ({zoomLevel, handleScaleX}) => {
  return (
    <View style={styles.sliderWrapper}>
      <Text style={styles.sliderText}>Zoom level: {zoomLevel.current}</Text>
      <Slider
        animateTransitions
        // style={styles.slider}
        minimumValue={zoomMinLevel}
        maximumValue={zoomMaxLevel}
        step={zoomStep}
        trackClickable={true}
        value={zoomLevel.current || 1}
        onValueChange={handleScaleX}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  sliderWrapper: {
    flex: 9
  },
  sliderText: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    textAlign: 'center',
    padding: 0,
    marginBottom: -10,
    marginTop: 5
  },
  slider: {
    width: '100px',
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    marginLeft: 1,
    marginRight: 1,
    padding: 0,
    alignItems: 'stretch'
  },
});
