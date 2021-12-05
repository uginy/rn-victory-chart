// @ts-nocheck
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Button, Dimensions} from 'react-native';
import {View} from 'react-native';
import {
  VictoryAxis,
  VictoryBrushContainer,
  VictoryChart,
  VictoryLine,
  VictoryTheme,
  createContainer, VictoryScatter, VictoryZoomContainer,
} from 'victory-native';
import {debounce} from 'lodash-es';
import {format} from 'date-fns';
import {Label} from './Label';
import {Legend} from './Legend';
import {StyledHeadingTime, StyledLabelWrapper, StyledMainInnerWrapper, StyledWrapper} from './Styles';
import Svg, {Line, G} from 'react-native-svg';
import {Heading} from './Heading';

// Settings
const debounceTime = 100;
const debounceOver = 100;
const percentileK = 0.05;
const brushSkip = 4;
const degree = 2;
const mainChartWidth = 750;
const mainChartHeight = 270;
const zoomChartWidth = 750;
const zoomChartHeight = 100;
const legendChartHeight = 130;
const tickValues = [0.25, 0.5, 0.75, 1];
const zoomChartPadding = {top: 0, left: 0, right: 0, bottom: 40};
const mainChartPadding = {top: 50, left: 60, right: 50, bottom: 50};
const mainChartDomainPadding = {x: [0, 0], y: 0};
const zoomChartDomainPadding = {x: [0, 0], y: 0};
const animationDuration = 50;
const activeLineColor = 'blue';
const yDomainMarginTop = 1.1;
const allowZoom = true;
const allowPan = true;

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

const getEntireDomain = (data: any) => {
  return {
    y: [0, 1],
    x: [new Date(data[data.length - 2].date_time), new Date(data[1].date_time)], // Reverse order in this case
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
  const [showBrushContainer, setShowBrushContainer] = useState(false)
  const [, rerender] = useState(() => '');
  const size = useRef({width: mainChartWidth, height: mainChartHeight});

  const [allData, setAllData] = useState([]);
  const activeValues = useRef({});

  const redraw = debounce(rerender, debounceOver);

  const CustomTooltip = (props) => {
    const {x, activePoints, datum} = props;
    const time = format(new Date(datum.x), 'HH:mm:ss yyyy-MM-dd');
    for (const point of activePoints) {
      const id = point.childName;
      activeValues.current[mappedPropIds[id]] = point.y;
      activeValues.current['time'] = time;
    }
    redraw(x);
    const height = (size.current.height || mainChartHeight) - legendChartHeight - mainChartPadding.bottom - 50;
    return (
      <Svg height={height}
           width={size.current.width || mainChartWidth}>
        <G>
          <Line transform={`translate(${x}, 50)`}
                x1={0}
                y1={height}
                stroke={activeLineColor}
                strokeWidth={1}/>
        </G>
      </Svg>
    );
  };

  const zoomedData = useMemo(() => {
    const dataZoomed = filterDataZoomed(logdata, selectedDomain);
    const mapped = mappedData(dataZoomed);
    console.log(mapped)
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
    return {maxFlow: maxFlow * yDomainMarginTop || 1, maxP: maxP * yDomainMarginTop || 1};
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

  const handleLayout = () => {
    const {width: w, height: h} = Dimensions.get("window");
    size.current = {
      width: w,
      height: h
    }
    redraw();
  }
  const yAccessorFlow = (datum) => datum.y / maxLogsData.maxFlow;
  const yAccessorP = (datum) => datum.y / maxLogsData.maxP;
  const toolTypeAccessor = ({datum}) => `y: ${datum.y}`;

  useEffect(() => {
    let destroyed = false;
    if (!destroyed) {
      handleLayout();
      setSelectedDomain(getEntireDomain(logdata));
      setAllData(filterByPrecisionBrush(mappedData(logdata)));
    }
    return () => {
      // console.log('unmounted');
      destroyed = true;
    }
  }, [logdata]);

  return (
    <StyledWrapper>
      <Legend>
        <Heading
          color={'grey'}
          title={'Selected Time'}
          value={activeValues.current.time
            ?? format(selectedDomain.x[0], 'HH:mm:ss yyyy-MM-dd')
          }
        />
        <StyledLabelWrapper>
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
        </StyledLabelWrapper>
      </Legend>
      <StyledMainInnerWrapper>
        <VictoryChart
          theme={VictoryTheme.material}
          domainPadding={mainChartDomainPadding}
          width={size.current.width || mainChartWidth}
          height={(size.current.height - legendChartHeight) || mainChartHeight}
          scale={{x: 'time'}}
          domain={{y: [0, 1]}}
          responsive={true}
          zoomDomain={selectedDomain}
          onZoomDomainChange={handleZoom}
          padding={mainChartPadding}
          events={[
            {
              target: "data",
              eventHandlers: {
                onMouseOver: () => activate,
                onFocus: () => activate,
                onTouchStart: () => activate,
                onMouseOut: () => deactivate,
                onBlur: () => deactivate,
                onTouchEnd: () => deactivate
              }
            }
          ]}
          containerComponent={
            <VictoryZoomVoronoiContainer
              zoomDimension='x'
              allowPan={allowPan}
              allowZoom={allowZoom}
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
          {showFlow && <VictoryLine
            animate={{duration: animationDuration}}
            onZoomDomainChange={handleZoom}
            name='flow-line'
            style={{
              data: {stroke: 'tomato', width: 1},
            }}
            data={zoomedData.flow}
            y={(datum) => datum.y / maxValues.maxFlow}
          />}
          {showP1 && <VictoryLine
            animate={{duration: animationDuration}}
            name='p1-line'
            style={{data: {stroke: 'green'}}}
            data={zoomedData.p1}
            y={(datum) => datum.y / maxValues.maxP}
          />}
          {showP2 && <VictoryLine
            animate={{duration: animationDuration}}
            name='p2-line'
            style={{data: {stroke: 'black'}}}
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
            tickFormat={(t) => Number(t * maxValues.maxP / yDomainMarginTop).toFixed(1)}
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
            offsetX={(size.current.width || mainChartWidth) - 50}
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
                textAnchor: 'start',
              },
            }}
            tickFormat={t => Number(t * maxValues.maxFlow / yDomainMarginTop).toPrecision(2)}
          />
          <VictoryAxis offsetY={size.current.height - legendChartHeight - 50}
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

        {showBrushContainer &&
          <VictoryChart
            domain={{y: [0, 1]}}
            domainPadding={zoomChartDomainPadding}
            width={size.current.width - 100 || zoomChartWidth}
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
          </VictoryChart>}
        <View>
          <Button onPress={() => {
            setSelectedDomain(getEntireDomain(logdata))
          }} title={'Reset Zoom'}/>
        </View>
      </StyledMainInnerWrapper>
    </StyledWrapper>
  );
}
