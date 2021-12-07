export const settings = {
  debounceTime: 100,
  debounceOver: 35,
  percentileK: 0.05,
  brushSkip: 4,
  degree: 2,

  legendChartHeight: 80,
  mainChartWidth: 1250,
  mainChartHeight: 600,

  zoomChartWidth: 900,
  zoomChartHeight: 100,

  mainChartPadding: {top: 50, left: 60, right: 50, bottom: 40},
  mainChartDomainPadding: {x: [0, 0], y: 0},

  zoomChartDomainPadding: {x: [35, 35], y: 0},
  zoomChartPadding: {top: 0, left: 0, right: 0, bottom: 40},

  optionsChartHeight: 50,
  globalPadding: 10,

  tickValues: [0.25, 0.5, 0.75, 1],
  animationDuration: 50,
  activeLineColor: 'blue',
  yDomainMarginTop: 1.1,
  chartStopOpacity: 0.5,

// Mapped Object
  mappedPropNames: {
    flow: 'flow',
    p1: 'pressure_p1_avg',
    p2: 'pressure_p2_avg',
  },
  mappedPropIds: {
    'flow-line': 'flow',
    'p1-line': 'p1',
    'p2-line': 'p2',
  },
}
