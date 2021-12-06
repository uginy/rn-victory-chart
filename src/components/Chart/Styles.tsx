
import styled from 'styled-components/native';
import { Platform } from 'react-native';
export const StyledWrapper = styled.View`
  display: flex;
  flex-direction: column;
  height: 100%;
  flex-grow: 1;
  padding: 5px;
`;

export const StyledMainInnerWrapper = styled.View`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5px 0 0;
  margin-top: -38px;
`

export const StyledLegendWrapper = styled.View<{ height?: number }>`
  padding: 0;
  width: 100%;
  z-index: 9999;
  height: ${({height}) => !!height ? `${height}px` : '50px'};
`

export const StyledLegendInner = styled.View`
  padding: 5px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  border: 1px solid silver;
`

export const StyledLegendHeader = styled.View`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
`

export const StyledLegendLabel = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 10px;
  flex: 1;
`

export const StyledLegendModeLabel = styled.View`
  display: flex;
  flex: 3;
  flex-direction: column;
  align-items: center;
  height: 80%;
`

export const StyledLabelWrapper = styled.View`
  display: flex;
  flex-direction: row;
`

export const StyledSwitchMode = styled.View`
  position: absolute;
  top: ${() => Platform.OS === 'ios' ? '10px': '2px'} 
`

export const StyledOptions = styled.View<{ height?: number; }>`
  display: flex;
  align-items: center;
  flex-direction: row;
  width: 100%;
  padding: 0 10px;
  border: 1px solid silver;
  border-radius: 5px;
  height: ${({height}) => !!height ? `${height}px` : '50px'};
  justify-content: space-between;
`
