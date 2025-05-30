// Sample OHLC data for BANKNIFTY
const sampleData = [
  { time: '2023-06-01', open: 44200, high: 44350, low: 43900, close: 44100 },
  { time: '2023-06-02', open: 44150, high: 44300, low: 43800, close: 44000 },
  { time: '2023-06-05', open: 43950, high: 44100, low: 43700, close: 43900 },
  { time: '2023-06-06', open: 43950, high: 44200, low: 43800, close: 44150 },
  { time: '2023-06-07', open: 44200, high: 44500, low: 44000, close: 44350 },
  { time: '2023-06-08', open: 44400, high: 44600, low: 44150, close: 44250 },
  { time: '2023-06-09', open: 44300, high: 44450, low: 44000, close: 44100 },
  { time: '2023-06-12', open: 44150, high: 44300, low: 43900, close: 44000 },
  { time: '2023-06-13', open: 44050, high: 44200, low: 43800, close: 43850 },
  { time: '2023-06-14', open: 43900, high: 44000, low: 43600, close: 43700 },
  { time: '2023-06-15', open: 43750, high: 43900, low: 43500, close: 43600 },
  { time: '2023-06-16', open: 43650, high: 43800, low: 43400, close: 43500 },
  { time: '2023-06-19', open: 43550, high: 43700, low: 43300, close: 43400 },
  { time: '2023-06-20', open: 43450, high: 43600, low: 43200, close: 43350 },
  { time: '2023-06-21', open: 43400, high: 43550, low: 43150, close: 43300 },
  { time: '2023-06-22', open: 43350, high: 43500, low: 43100, close: 43250 },
  { time: '2023-06-23', open: 43300, high: 43450, low: 43050, close: 43200 },
  { time: '2023-06-26', open: 43250, high: 43400, low: 43000, close: 43150 },
  { time: '2023-06-27', open: 43200, high: 43350, low: 42950, close: 43100 },
  { time: '2023-06-28', open: 43150, high: 43300, low: 42900, close: 43050 },
  { time: '2023-06-29', open: 43100, high: 43250, low: 42850, close: 43000 },
  { time: '2023-06-30', open: 43050, high: 43200, low: 42800, close: 42950 },
  { time: '2023-07-03', open: 43000, high: 43150, low: 42750, close: 42900 },
  { time: '2023-07-04', open: 42950, high: 43100, low: 42700, close: 42850 },
  { time: '2023-07-05', open: 42900, high: 43050, low: 42650, close: 42800 },
  { time: '2023-07-06', open: 42850, high: 43000, low: 42600, close: 42900 },
  { time: '2023-07-07', open: 42950, high: 43100, low: 42700, close: 43000 },
  { time: '2023-07-10', open: 43050, high: 43200, low: 42800, close: 43100 },
  { time: '2023-07-11', open: 43150, high: 43300, low: 42900, close: 43200 },
  { time: '2023-07-12', open: 43250, high: 43400, low: 43000, close: 43300 },
  { time: '2023-07-13', open: 43350, high: 43500, low: 43100, close: 43450 },
  { time: '2023-07-14', open: 43500, high: 43650, low: 43250, close: 43600 },
  { time: '2023-07-17', open: 43650, high: 43800, low: 43400, close: 43750 },
  { time: '2023-07-18', open: 43800, high: 43950, low: 43550, close: 43900 },
  { time: '2023-07-19', open: 43950, high: 44100, low: 43700, close: 44050 },
  { time: '2023-07-20', open: 44100, high: 44250, low: 43850, close: 44200 },
  { time: '2023-07-21', open: 44250, high: 44400, low: 44000, close: 44350 },
  { time: '2023-07-24', open: 44400, high: 44550, low: 44150, close: 44500 },
  { time: '2023-07-25', open: 44550, high: 44700, low: 44300, close: 44650 },
  { time: '2023-07-26', open: 44700, high: 44850, low: 44450, close: 44800 },
  { time: '2023-07-27', open: 44850, high: 45000, low: 44600, close: 44900 },
  { time: '2023-07-28', open: 44950, high: 45100, low: 44700, close: 45000 },
  { time: '2023-07-31', open: 45050, high: 45200, low: 44800, close: 45150 },
  { time: '2023-08-01', open: 45200, high: 45350, low: 44950, close: 45300 },
  { time: '2023-08-02', open: 45350, high: 45500, low: 45100, close: 45450 },
  { time: '2023-08-03', open: 45500, high: 45650, low: 45250, close: 45600 },
  { time: '2023-08-04', open: 45650, high: 45800, low: 45400, close: 45750 },
  { time: '2023-08-07', open: 45800, high: 45950, low: 45550, close: 45900 },
  { time: '2023-08-08', open: 45950, high: 46100, low: 45700, close: 46050 },
  { time: '2023-08-09', open: 46100, high: 46250, low: 45850, close: 46000 },
  { time: '2023-08-10', open: 46050, high: 46200, low: 45800, close: 45900 },
  { time: '2023-08-11', open: 45950, high: 46100, low: 45700, close: 45850 },
  { time: '2023-08-14', open: 45900, high: 46050, low: 45650, close: 45800 },
  { time: '2023-08-16', open: 45850, high: 46000, low: 45600, close: 45750 },
  { time: '2023-08-17', open: 45800, high: 45950, low: 45550, close: 45700 },
  { time: '2023-08-18', open: 45750, high: 45900, low: 45500, close: 45650 },
  { time: '2023-08-21', open: 45700, high: 45850, low: 45450, close: 45600 },
  { time: '2023-08-22', open: 45650, high: 45800, low: 45400, close: 45550 },
  { time: '2023-08-23', open: 45600, high: 45750, low: 45350, close: 45500 },
  { time: '2023-08-24', open: 45550, high: 45700, low: 45300, close: 45450 },
  { time: '2023-08-25', open: 45500, high: 45650, low: 45250, close: 45400 },
];

// Convert date strings to timestamps for the chart
const formattedData = sampleData.map(candle => ({
  ...candle,
  time: Math.floor(new Date(candle.time).getTime() / 1000)
}));

export default formattedData; 