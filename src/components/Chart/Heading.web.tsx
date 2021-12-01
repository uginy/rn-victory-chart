import React from 'react';

interface Props {
  title: string;
  value: string;
}

export const Heading = ({title, value}: Props) => {
  return !!value && (
    <div className="chart_legend__time_header">{`${title}:  ${value}`}</div>
  )
};
