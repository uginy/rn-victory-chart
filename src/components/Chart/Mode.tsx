import React, {FC} from 'react';
import {Switch, Text} from 'react-native';
import {StyledLegendModeLabel, StyledSwitchMode} from './Styles';

interface Props {
  text: string;
  show: boolean;
  setShow: (p: (prev: boolean) => boolean) => void;
  color: string;
  altColor: string;
}

export const Mode: FC<Props> = ({text, show, setShow, color = 'green', altColor = 'blue'}) => {
  return (
    <StyledLegendModeLabel>
        <Text>{text}</Text>
      <StyledSwitchMode>
        <Switch
          style={{transform: [{scaleX: 1}, {scaleY: 1}], padding: 0, marginTop: 9}}
          trackColor={{false: "silver", true: "silver"}}
          thumbColor={show ? color : altColor}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => setShow(prev => !prev)}
          value={show}
        />
      </StyledSwitchMode>
    </StyledLegendModeLabel>
  );
};
