import React, {FC} from 'react';
import styled from 'styled-components';
import Switch from '@mui/material/Switch';

interface Props {
  text: string;
  show: boolean;
  setShow: (p: (prev: boolean) => boolean) => void;
  value: number;
  color: string;
}

export const Label: FC<Props> = ({text, show, setShow, value = 0, color}) => {
  return (
    <div
      className="chart_legend_label"
      style={{color: show ? color : 'grey'}}
    >
      <StyledSwitch>
        <Switch
          style={{ color: color}}
          onChange={() => setShow(prev => !prev)}
          checked={show}
          />
        <span>&nbsp;{text}:</span>
      </StyledSwitch>
      <span>{value}</span>
    </div>
  );
};

const StyledSwitch = styled.div`
  display: flex; 
  align-items: center;
`
