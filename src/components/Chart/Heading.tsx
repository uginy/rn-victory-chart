import React from 'react';
import {Text} from 'react-native';
import {StyledLegendHeader} from './Styles';

interface Props {
  title: string;
  value: string;
  color?: string;
}

export const Heading = ({title, value, color = 'black'}: Props) => {
  return !!value && (
    <StyledLegendHeader>
        <Text style={{ color }}>{title}: </Text><Text>{value}</Text>
    </StyledLegendHeader>
  )
};
