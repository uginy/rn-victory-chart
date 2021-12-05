// @ts-nocheck
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Dimensions, StyleSheet} from 'react-native';
import {
  createContainer,
  VictoryAxis,
  VictoryChart,
  VictoryArea,
  VictoryTheme,
} from 'victory-native';
import Svg, {G, Line, Defs, LinearGradient, Stop} from 'react-native-svg';
import {MaterialIcons} from '@expo/vector-icons';
import {debounce} from 'lodash-es';
import {format} from 'date-fns';
import {Label} from './Label';
import {Legend} from './Legend';
import {Heading} from './Heading';
import {Mode} from './Mode';
import {StyledLabelWrapper, StyledMainInnerWrapper, StyledOptions, StyledWrapper} from './Styles';

// Settings
const debounceOver = 100;
const percentileK = 0.05;
const degree = 2;
const mainChartWidth = 750;
const mainChartHeight = 270;
const mainChartBottomAxisHeight = 10;
const optionsChartHeight = 40;
const legendChartHeight = 130;
const tickValues = [0.25, 0.5, 0.75, 1];
const mainChartPadding = {top: 50, left: 60, right: 50, bottom: 40};
const mainChartDomainPadding = {x: [0, 0], y: 0};
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


const getEntireDomain = (data: any) => {
  return {
    y: [0, 1],
    x: [new Date(data[data.length - 1].date_time), new Date(data[0].date_time)], // Reverse order in this case
  };
};

const zoomIt = (data: any, level) => {
  const stepSize = 2 * parseInt(level);
  const xStart = new Date(data[data.length - stepSize].date_time);
  const xEnd = new Date(data[stepSize - 1].date_time);
  return {
    y: [0, 1],
    x: [xStart, xEnd], // Reverse order in this case
  }
}

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

const VictoryZoomVoronoiContainer = createContainer('zoom', 'voronoi');

export default function Chart({logdata, maxVisiblePoints}: ChartProps) {

  const [selectedDomain, setSelectedDomain] = useState(getEntireDomain(logdata));
  const [showFlow, setShowFlow] = useState(true);
  const [showP1, setShowP1] = useState(true);
  const [showP2, setShowP2] = useState(true);
  const [panning, setPanning] = useState(false);

  const [, rerender] = useState(() => '');
  const size = useRef({width: mainChartWidth, height: mainChartHeight});
  const zoomLevel = useRef(1);
  const activeValues = useRef({});

  const redraw = debounce(rerender, debounceOver);

  const CustomTooltip = (props) => {
    if (panning) {
      return <></>;
    }
    const {x, activePoints, datum} = props;
    const time = format(new Date(datum.x), 'HH:mm:ss yyyy-MM-dd');
    for (const point of activePoints) {
      const id = point.childName;
      activeValues.current[mappedPropIds[id]] = point.y;
      activeValues.current['time'] = time;
    }
    redraw(x);
    const height = (size.current.height || mainChartHeight)
      - legendChartHeight - optionsChartHeight - mainChartPadding.bottom - mainChartBottomAxisHeight;
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
    return filterByPrecision(mapped, maxVisiblePoints);
  }, [logdata]);

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

  const handleZoom = domain => {
    setSelectedDomain(() => ({...domain}));
  }

  const handleLayout = () => {
    const {width: w, height: h} = Dimensions.get("window");
    size.current = {
      width: w,
      height: h
    }
    redraw();
  }
  const yAccessorFlow = (datum) => datum.y / maxValues.maxFlow
  const yAccessorP = (datum) => datum.y / maxValues.maxP
  const toolTypeAccessor = ({datum}) => `y: ${datum.y}`;

  useEffect(() => {
    let destroyed = false;
    if (!destroyed) {
      handleLayout();
      setSelectedDomain(getEntireDomain(logdata));
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
        <Defs>
          <LinearGradient id="flow-grad" style={{transform: 'rotate(90deg)'}}>
            <Stop offset="0%" stopColor="#9c0000"/>
            <Stop offset="50%" stopColor="#e84d4d"/>
            <Stop offset="100%" stopColor="#ff9e9e"/>
          </LinearGradient>
        </Defs>
        <Defs>
          <LinearGradient id="p1-grad" style={{transform: 'rotate(90deg)'}}>
            <Stop offset="0%" stopColor="#174f1a"/>
            <Stop offset="50%" stopColor="#39913d"/>
            <Stop offset="100%" stopColor="#75d97a"/>
          </LinearGradient>
        </Defs>
        <Defs>
          <LinearGradient id="p2-grad" style={{transform: 'rotate(90deg)'}}>
            <Stop offset="0%" stopColor="#000000"/>
            <Stop offset="50%" stopColor="#555555"/>
            <Stop offset="100%" stopColor="#DDDDDD"/>
          </LinearGradient>
        </Defs>
        <VictoryChart
          theme={VictoryTheme.material}
          domainPadding={mainChartDomainPadding}
          width={size.current.width || mainChartWidth}
          height={(size.current.height - legendChartHeight) || mainChartHeight}
          scale={{x: 'time'}}
          domain={getEntireDomain(logdata)}
          responsive={true}
          padding={mainChartPadding}
          containerComponent={
            <VictoryZoomVoronoiContainer
              zoomDimension='x'
              zoomDomain={selectedDomain}
              onZoomDomainChange={handleZoom}
              allowPan={panning}
              allowZoom={panning}
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
            name='flow-line'
            data={zoomedData.flow}
            y={yAccessorFlow}
            style={{
              data: {
                stroke: 'tomato',
                fill: 'tomato'
                // fill: 'url(#flow-grad)'
              },
            }}
          />}
          {showP1 && <VictoryArea
            animate={{duration: animationDuration}}
            name='p1-line'
            style={{
              data: {
                stroke: 'green',
                fill: 'green'
                // fill: 'url(#p1-grad)'
              }
            }}
            data={zoomedData.p1}
            y={yAccessorP}
          />}
          {showP2 && <VictoryArea
            animate={{duration: animationDuration}}
            name='p2-line'
            style={{
              data: {
                stroke: 'black',
                fill: 'black'
                // fill: 'url(#p2-grad)'
              }
            }}
            data={zoomedData.p2}
            y={yAccessorP}
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

        <StyledOptions>
          <MaterialIcons
            style={styles.roundButton}
            name="zoom-out"
            onPress={() => {
              if (zoomLevel.current > 1) {
                zoomLevel.current--;
              }
              setSelectedDomain(zoomIt(logdata, zoomLevel.current));
            }}/>
          <MaterialIcons
            style={styles.roundButton}
            name="zoom-out-map"
            onPress={() => {
              zoomLevel.current = 1;
              setSelectedDomain(getEntireDomain(logdata));
              zoomIt(logdata, zoomLevel.current)
            }}/>
          <MaterialIcons
            style={styles.roundButton}
            name="zoom-in"
            onPress={() => {
              if (zoomLevel.current < 10) {
                zoomLevel.current++;
              }
              setSelectedDomain(zoomIt(logdata, zoomLevel.current));
              zoomIt(logdata, zoomLevel.current)
            }}/>
          <Mode
            text={panning ? 'Zoom/Pan' : 'Select'}
            show={panning}
            setShow={setPanning}
            color='green'
            altColor='orange'
          />
        </StyledOptions>
      </StyledMainInnerWrapper>
    </StyledWrapper>
  );
}

/// Just some styles
const styles = StyleSheet.create({
  roundButton: {
    color: 'black',
    fontSize: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
    padding: 3,
  }
});
