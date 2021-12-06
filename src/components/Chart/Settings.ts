export const settings = {
  debounceOver: 35,
  percentileK: 0.05,
  degree: 2,
  legendChartHeight: 100,
  mainChartWidth: 750,
  mainChartHeight: 270,

  mainChartPadding: {top: 50, left: 60, right: 50, bottom: 40},
  mainChartDomainPadding: {x: [0, 0], y: 0},

  optionsChartHeight: 60,
  globalPadding: 10,

  tickValues: [0.25, 0.5, 0.75, 1],
  animationDuration: 50,
  activeLineColor: 'blue',
  yDomainMarginTop: 1.1,

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
