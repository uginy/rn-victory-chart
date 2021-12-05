import React, {FC} from 'react';
import {Switch, View, Text} from 'react-native';
import {StyledLegendLabel} from './Styles';

interface Props {
  text: string;
  show: boolean;
  setShow: (p: (prev: boolean) => boolean) => void;
  color: string;
  altColor: string;
}

export const Mode: FC<Props> = ({text, show, setShow, color = 'green', altColor = 'blue'}) => {
  return (
    <StyledLegendLabel>
      <View>
        <Text> {text} </Text>
      </View>
      <View>
        <Switch
          style={{transform: [{scaleX: .8}, {scaleY: .8}]}}
          trackColor={{false: "silver", true: "silver"}}
          thumbColor={show ? color : altColor}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => setShow(prev => !prev)}
          value={show}
        />
      </View>
    </StyledLegendLabel>
  );
};
