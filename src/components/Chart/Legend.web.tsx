import * as React from 'react';
import {FC} from 'react';


export const Legend: FC = ({children}) => {
  return (
    <div className="chart_legend_wrapper">
      <div className="chart_legend_inner">{children}</div>
    </div>
  );
};
