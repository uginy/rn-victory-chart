// @ts-nocheck
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  VictoryAxis,
  VictoryBrushContainer,
  VictoryChart,
  VictoryLine,
  VictoryTheme,
  createContainer, VictoryArea,
} from 'victory';
import {debounce, last} from 'lodash';
import {format} from 'date-fns';
import {Label} from './Label';
import {Heading} from './Heading';
import {Legend} from './Legend';
import {StyledWrapper} from './Styles';

// Settings
const debounceTime = 100;
const debounceOver = 100;
const percentileK = 0.05;
const brushSkip = 4;
const degree = 2;
const mainChartWidth = 1250;
const mainChartHeight = 500;
const zoomChartWidth = 900;
const zoomChartHeight = 100;
const tickValues = [0.25, 0.5, 0.75, 1];
const zoomChartPadding = {top: 0, left: 0, right: 0, bottom: 40};
const mainChartDomainPadding = {x: [0, 0], y: 0};
const zoomChartDomainPadding = {x: [35, 35], y: 0};
const animationDuration = 50;
const activeLineColor = 'blue';
const yDomainMarginTop = 1.1;

// Mapped Object
const mappedPropNames = {
  flow: 'flow',
  p1: 'pressure_p1_avg',
  p2: 'pressure_p2_avg',
};
const mappedPropIds = {
  'flow-line': 'flow',
  'p1-line': 'p1',
  'p2-line': 'p2',
};

// To allow use several containerComponents
const VictoryZoomVoronoiContainer = createContainer('voronoi', 'zoom');

const getEntireDomain = (data) => {
  return {
    y: [0, 1],
    x: [new Date(last(data).date_time), new Date(data[0].date_time)], // Reverse order in this case
  };
};

interface ChartProps {
  logdata: any;
  maxVisiblePoints: number;
}

const mappedData = (data) => {
  const newMappedData = {
    flow: [],
    p1: [],
    p2: [],
  };
  for (let i = 0; i < data.length; i++) {
    const x = new Date(data[i].date_time);
    const val = data[i];
    for (const prop in mappedPropNames) {
      newMappedData[prop].push({x, y: val[mappedPropNames[prop]]});
    }
  }
  return newMappedData;
};

const filterDataZoomed = (dataItems, selectedDomain) =>
  dataItems.filter(d => new Date(d?.date_time) >= new Date(selectedDomain.x[0])
    && new Date(d?.date_time) <= new Date(selectedDomain.x[1]));

const filterByPrecision = (data, maxPoints) => {
  const newData = {};
  for (let prop in data) {
    if (data[prop].length > maxPoints) {
      const k = Math.pow(degree, Math.ceil(Math.log2(data[prop].length / maxPoints)));
      const percentile = (index) =>
        Math.abs((data[prop][index + 1]?.y - data[prop][index]?.y)) / (data[prop][index + 1]?.y + 1) > percentileK;
      newData[prop] = data[prop].filter((d, i) => ((i % k) === 0 || percentile(i)));
    } else {
      newData[prop] = data[prop];
    }
    newData['length'] = newData[prop].length;
  }
  return newData;
};

const filterByPrecisionBrush = (data) => {
  const newData = {};
  for (let prop in data) {
    if (data.hasOwnProperty(prop)) {
      newData[prop] = data[prop].filter((d, i) => i % brushSkip === 0);
    }
  }
  return newData;
};

export default function Chart({logdata, maxVisiblePoints}: ChartProps) {

  const [selectedDomain, setSelectedDomain] = useState(getEntireDomain(logdata));
  const [showFlow, setShowFlow] = useState(true);
  const [showP1, setShowP1] = useState(true);
  const [showP2, setShowP2] = useState(true);
  const [, rerender] = useState(() => '');

  const [allData, setAllData] = useState([]);
  const activeValues = useRef({});

  const redraw = debounce(rerender, debounceOver);

  const CustomTooltip = (props) => {
    const {x, activePoints, datum} = props;
    const time = format(new Date(datum.x), 'yyyy-MM-dd HH:mm:ss');
    for (const point of activePoints) {
      const id = point.childName;
      activeValues.current[mappedPropIds[id]] = point.y;
      activeValues.current['time'] = time;
    }
    redraw(x);

    return (
      <g>
        <line transform={`translate(${x}, 50)`}
              x1={0}
              y1={mainChartHeight - 100}
              stroke={activeLineColor}
              strokeWidth={1}/>
      </g>
    );
  };

  const zoomedData = useMemo(() => {
    const dataZoomed = filterDataZoomed(logdata, selectedDomain);
    const mapped = mappedData(dataZoomed);
    return filterByPrecision(mapped, maxVisiblePoints);
  }, [selectedDomain, logdata]);

  const maxValues = useMemo(() => {
    let maxFlow = zoomedData?.flow?.length > 0 ? Math.max(...zoomedData.flow.map((d) => d?.y)) : 1;
    let maxP1 = zoomedData?.p1?.length > 0 ? Math.max(...zoomedData.p1.map((d) => d?.y)) : 1;
    let maxP2 = zoomedData.p2?.length > 0 ? Math.max(...zoomedData.p2.map((d) => d?.y)) : 1;
    if (!showP1) {
      maxP1 = 1;
    }
    if (!showP2) {
      maxP2 = 1;
    }
    if (!showFlow) {
      maxFlow = 1;
    }
    const maxP = maxP1 > maxP2 ? maxP1 : maxP2;
    return {maxFlow: maxFlow * yDomainMarginTop, maxP: maxP * yDomainMarginTop};
  }, [zoomedData, showP1, showP2, showFlow]);

  const maxLogsData = useMemo(() => {
    const dataLogs = mappedData(logdata);
    const maxFlow = dataLogs?.flow?.length > 0 ? Math.max(...dataLogs.flow.map((d) => d?.y)) : 1;
    const maxP1 = dataLogs?.p1?.length > 0 ? Math.max(...dataLogs.p1.map((d) => d?.y)) : 1;
    const maxP2 = dataLogs.p2?.length > 0 ? Math.max(...dataLogs.p2.map((d) => d?.y)) : 1;
    const maxP = maxP1 > maxP2 ? maxP1 : maxP2;
    return {maxFlow, maxP};
  }, [logdata]);

  const handleZoom = debounce((domain) => {
    setSelectedDomain(domain);
  }, debounceTime);

  const yAccessorFlow = (datum) => datum.y / maxLogsData.maxFlow;
  const yAccessorP = (datum) => datum.y / maxLogsData.maxP;
  const toolTypeAccessor = ({datum}) => `y: ${datum.y}`;

  useEffect(() => {
    setSelectedDomain(getEntireDomain(logdata));
    setAllData(filterByPrecisionBrush(mappedData(logdata)));
  }, [logdata]);

  return (
    <StyledWrapper>
      <div className="chart_main_inner_wrapper">
        <svg style={{height: 0}}>
          <defs>
            <linearGradient id="flow-grad" style={{ transform: 'rotate(90deg)'}}>
              <stop offset="0%" stopColor="#9c0000"/>
              <stop offset="50%" stopColor="#e84d4d"/>
              <stop offset="100%" stopColor="#ff9e9e"/>
            </linearGradient>
          </defs>
          <defs>
            <linearGradient id="p1-grad" style={{ transform: 'rotate(90deg)'}}>
              <stop offset="0%" stopColor="#174f1a"/>
              <stop offset="50%" stopColor="#39913d"/>
              <stop offset="100%" stopColor="#75d97a"/>
            </linearGradient>
          </defs>
          <defs>
            <linearGradient id="p2-grad" style={{ transform: 'rotate(90deg)'}}>
              <stop offset="0%" stopColor="#000000"/>
              <stop offset="50%" stopColor="#555555"/>
              <stop offset="100%" stopColor="#DDDDDD"/>
            </linearGradient>
          </defs>
        </svg>
        <VictoryChart
          theme={VictoryTheme.material}
          domainPadding={mainChartDomainPadding}
          width={mainChartWidth}
          height={mainChartHeight}
          scale={{x: 'time'}}
          domain={{y: [0, 1]}}
          containerComponent={
            <VictoryZoomVoronoiContainer
              zoomDimension='x'
              allowPan={false}
              allowZoom={false}
              zoomDomain={selectedDomain}
              onZoomDomainChange={handleZoom}
              voronoiDimension='x'
              labels={toolTypeAccessor}
              labelComponent={
                <CustomTooltip
                  style={{fontSize: 9}}
                  cornerRadius={2}
                  pointerLength={0}
                />
              }
            />
          }
        >
          {showFlow && <VictoryArea
            animate={{duration: animationDuration}}
            onZoomDomainChange={handleZoom}
            name='flow-line'
            style={{
              data: {fill: "url(#flow-grad)", width: 1},
            }}
            data={zoomedData.flow}
            y={(datum) => datum.y / maxValues.maxFlow}
          />}
          {showP1 && <VictoryArea
            animate={{duration: animationDuration}}
            name='p1-line'
            style={{data: {fill: "url(#p1-grad)"}}}
            data={zoomedData.p1}
            y={(datum) => datum.y / maxValues.maxP}
          />}
          {showP2 && <VictoryArea
            animate={{duration: animationDuration}}
            name='p2-line'
            style={{data: {fill: "url(#p2-grad)"}}}
            data={zoomedData.p2}
            y={(datum) => datum.y / maxValues.maxP}
          />}
          <VictoryAxis
            domain={{y: [0, 1]}}
            key='1'
            label='Pressure [bar]'
            dependentAxis
            domainPadding={{y: 15}}
            tickValues={tickValues}
            tickFormat={(t) => t * maxValues.maxP / yDomainMarginTop}
            style={{
              axisLabel: {fontSize: 14, padding: 35},
              grid: {
                strokeWidth: 0, stroke: 'grey',
              },
              ticks: {stroke: 'black', transformOrigin: 'center', paddingLeft: '10'},
              tickLabels: {
                fontSize: 10,
                padding: 4,
                display: ({tick}) => {
                  const everyFive = (Math.round(tick * 100) / 100) % 0.25;
                  return everyFive === 0 ? 'block' : 'none';
                },
              },
            }}
          />
          <VictoryAxis
            domain={{y: [0, 1]}}
            dependentAxis
            key='2'
            label='Flow [m³/h]'
            offsetX={mainChartWidth - 50}
            tickValues={tickValues}
            style={{
              axisLabel: {fontSize: 14, padding: -35},
              grid: {
                strokeWidth: ({tick}) => {
                  const everyFive = (Math.round(tick * 100) / 100) % 0.25;
                  return everyFive === 0 ? 1 : 0.4;
                },
                stroke: 'grey',
              },
              ticks: {stroke: 'red'},
              tickLabels: {
                fontSize: 10,
                padding: -10,
                textAnchor: 'revert',
              },
            }}
            tickFormat={t => Number(t * maxValues.maxFlow / yDomainMarginTop).toPrecision(2)}
          />
          <VictoryAxis offsetY={mainChartHeight - 50}
                       style={{tickLabels: {display: 'none'}}}
          />
          <VictoryAxis label='Time'
                       style={{
                         axisLabel: {fontSize: 14, padding: 20},
                         grid: {strokeWidth: 1, stroke: 'grey'},
                         ticks: {stroke: 'black'},
                         tickLabels: {
                           fontSize: 10,
                           padding: 3,
                           textAnchor: 'middle',
                         },
                       }}/>
        </VictoryChart>

        <VictoryChart
          domain={{y: [0, 1]}}
          domainPadding={zoomChartDomainPadding}
          width={zoomChartWidth}
          height={zoomChartHeight}
          scale={{x: 'time'}}
          padding={zoomChartPadding}
          containerComponent={
            <VictoryBrushContainer
              brushDimension='x'
              height={zoomChartHeight}
              brushDomain={{x: selectedDomain.x}}
              onBrushDomainChange={handleZoom}
            />
          }
        >
          <VictoryAxis label='time' style={{
            axisLabel: {display: 'none'},
            tickLabels: {fontSize: 8, padding: 4},
          }}
          />
          <VictoryLine
            style={{data: {stroke: 'tomato', strokeWidth: 0.7}}}
            y={yAccessorFlow}
            data={allData.flow}
          />
          <VictoryLine
            style={{data: {stroke: 'green', strokeWidth: 0.7}}}
            data={allData.p1}
            y={yAccessorP}
          />
          <VictoryLine
            style={{data: {stroke: 'black', strokeWidth: 0.7}}}
            data={allData.p2}
            y={yAccessorP}
          />
        </VictoryChart>
        <div style={{paddingBottom: `${zoomChartPadding.bottom}px`}}>&nbsp;</div>
      </div>
      <Legend>
        <Heading
          title={'Time'}
          value={activeValues.current.time
            ?? format(selectedDomain.x[0], 'yyyy-MM-dd HH:mm:ss')
          }
        />
        <hr size={1} width={'100%'}/>
        <Label
          text='flow'
          show={showFlow}
          setShow={setShowFlow}
          value={activeValues.current.flow}
          color='tomato'
        />
        <Label
          color='green'
          text='P1'
          show={showP1}
          setShow={setShowP1}
          value={activeValues.current.p1}
        />
        <Label
          text='P2'
          show={showP2}
          setShow={setShowP2}
          value={activeValues.current.p2}
          color='black'
        />

        <hr size={1} width={'100%'}/>
        <Heading
          title={'Visible Points'}
          value={zoomedData.length}
        />
      </Legend>
    </StyledWrapper>
  );
}
