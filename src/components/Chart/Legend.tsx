import * as React from 'react';
import {FC} from 'react';
import {StyledLegendInner, StyledLegendWrapper} from './Styles';

export const Legend: FC = ({children}) => {
  return (
    <StyledLegendWrapper>
      <StyledLegendInner>{children}</StyledLegendInner>
    </StyledLegendWrapper>
  );
};
