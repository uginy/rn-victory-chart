// @ts-ignore
import styled from 'styled-components/native';

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

export const StyledLegendWrapper = styled.View`
  padding: 0;
  width: 100%;
  z-index: 9999;
`

export const StyledLegendInner = styled.View`
  padding: 0;
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
  flex-direction: row;
  justify-content: space-between;
  padding: 0 10px;
  align-items: center;
`

export const StyledLabelWrapper = styled.View`
  display: flex;
  flex-direction: row;
`

export const StyledOptions = styled.View`
  display: flex;
  align-items: center;
  flex-direction: row;
  width: 100%;
  padding: 0;
  justify-content: space-evenly;
`
