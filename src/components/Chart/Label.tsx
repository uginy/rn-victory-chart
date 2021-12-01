import React, {FC} from 'react';
import {Switch, View, Text} from 'react-native';
import {StyledLegendLabel} from './Styles';

interface Props {
  text: string;
  show: boolean;
  setShow: (p: (prev: boolean) => boolean) => void;
  value: number;
  color: string;
}

export const Label: FC<Props> = ({text, show, setShow, value = 0, color = 'green'}) => {
  return (
    <StyledLegendLabel>
      <View>
        <Switch
          style={{ transform: [{ scaleX: .8 }, { scaleY: .8 }] }}
          trackColor={{false: "silver", true: "silver"}}
          thumbColor={show ? color : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => setShow(prev => !prev)}
          value={show}
        />
      </View>
      <View>
        <Text> {text}: </Text>
      </View>
      <View>
        <Text>{value}</Text>
      </View>
    </StyledLegendLabel>
  );
};
