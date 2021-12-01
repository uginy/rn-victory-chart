import React from 'react';
import {Text} from 'react-native';
import {StyledLegendHeader} from './Styles';

interface Props {
  title: string;
  value: string;
}

export const Heading = ({title, value}: Props) => {
  return !!value && (
    <StyledLegendHeader>
        <Text>{title}: </Text><Text>{value}</Text>
    </StyledLegendHeader>
  )
};
