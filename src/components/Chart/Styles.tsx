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
  padding:2px 0 0;
  width: 100%;
  z-index: 9999;
`

export const StyledLegendInner = styled.View`
  padding-top: 8px;
  border-radius: 5px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
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
  padding: 5px 10px;
  align-items: center;
  font-size: 20px;
`
