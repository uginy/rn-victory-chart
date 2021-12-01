import React, {FC} from 'react';
import {Switch} from 'react-native';

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
      <div style={{ display: 'flex'}}>
        <Switch
          trackColor={{false: "silver", true: "#e3e3e3"}}
          thumbColor={show ? color : "#f9f9f9"}
          onValueChange={() => setShow(prev => !prev)}
          ios_backgroundColor="#3e3e3e"
          value={show}
          />
        <span>&nbsp;{text}:</span>
      </div>
      <span>{value}</span>
    </div>
  );
};
