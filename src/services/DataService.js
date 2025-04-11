/**
 * Data Service for fetching real market data
 */

// Sample AAPL data (daily candles - recent historical data)
const aaplDailyData = [
  { time: '2023-01-03', open: 130.28, high: 130.90, low: 124.17, close: 125.07, volume: 112117500 },
  { time: '2023-01-04', open: 126.89, high: 128.66, low: 125.08, close: 126.36, volume: 88169300 },
  { time: '2023-01-05', open: 127.13, high: 127.77, low: 124.76, close: 125.02, volume: 80829200 },
  { time: '2023-01-06', open: 126.01, high: 130.29, low: 124.89, close: 129.62, volume: 87636300 },
  { time: '2023-01-09', open: 130.47, high: 133.41, low: 129.89, close: 130.15, volume: 70790800 },
  { time: '2023-01-10', open: 130.26, high: 131.25, low: 128.12, close: 130.73, volume: 63136300 },
  { time: '2023-01-11', open: 131.25, high: 133.51, low: 131.22, close: 133.49, volume: 69019800 },
  { time: '2023-01-12', open: 133.88, high: 134.26, low: 131.44, close: 133.41, volume: 71230700 },
  { time: '2023-01-13', open: 132.03, high: 134.92, low: 131.66, close: 134.76, volume: 57809700 },
  { time: '2023-01-17', open: 134.83, high: 137.29, low: 134.13, close: 135.94, volume: 63846400 },
  { time: '2023-01-18', open: 136.82, high: 138.61, low: 135.03, close: 135.21, volume: 69858300 },
  { time: '2023-01-19', open: 134.08, high: 136.25, low: 133.77, close: 135.27, volume: 58855200 },
  { time: '2023-01-20', open: 135.28, high: 138.02, low: 134.22, close: 137.87, volume: 80712300 },
  { time: '2023-01-23', open: 138.12, high: 143.32, low: 137.90, close: 141.11, volume: 81649300 },
  { time: '2023-01-24', open: 140.30, high: 143.16, low: 140.30, close: 142.53, volume: 60275100 },
  { time: '2023-01-25', open: 140.89, high: 142.43, low: 138.81, close: 141.86, volume: 65633100 },
  { time: '2023-01-26', open: 143.17, high: 144.25, low: 141.90, close: 143.96, volume: 54105100 },
  { time: '2023-01-27', open: 143.16, high: 147.23, low: 143.08, close: 145.93, volume: 70555800 },
  { time: '2023-01-30', open: 144.96, high: 145.55, low: 142.85, close: 143.00, volume: 64015300 },
  { time: '2023-01-31', open: 142.70, high: 144.34, low: 142.28, close: 144.29, volume: 65874500 },
  { time: '2023-02-01', open: 143.97, high: 146.61, low: 141.32, close: 145.43, volume: 77663600 },
  { time: '2023-02-02', open: 148.90, high: 151.97, low: 147.83, close: 150.82, volume: 118339000 },
  { time: '2023-02-03', open: 148.03, high: 157.38, low: 147.83, close: 154.50, volume: 154357300 },
  { time: '2023-02-06', open: 152.57, high: 153.10, low: 150.78, close: 151.73, volume: 69858000 },
  { time: '2023-02-07', open: 152.12, high: 155.23, low: 151.17, close: 154.65, volume: 83322600 },
  { time: '2023-02-08', open: 153.88, high: 154.58, low: 151.17, close: 151.92, volume: 57879400 },
  { time: '2023-02-09', open: 153.78, high: 154.33, low: 150.42, close: 150.87, volume: 56198000 },
  { time: '2023-02-10', open: 149.46, high: 151.34, low: 149.22, close: 151.01, volume: 57409100 },
  { time: '2023-02-13', open: 151.28, high: 154.26, low: 150.92, close: 153.85, volume: 53834000 },
  { time: '2023-02-14', open: 152.12, high: 153.77, low: 150.86, close: 153.20, volume: 61707600 },
  { time: '2023-02-15', open: 152.01, high: 155.50, low: 151.17, close: 155.33, volume: 65573800 },
  { time: '2023-02-16', open: 153.51, high: 156.33, low: 153.35, close: 153.71, volume: 68167900 },
  { time: '2023-02-17', open: 152.35, high: 153.00, low: 150.85, close: 152.55, volume: 59006300 },
  { time: '2023-02-21', open: 150.20, high: 151.30, low: 148.41, close: 148.48, volume: 58867200 },
  { time: '2023-02-22', open: 148.87, high: 149.95, low: 147.16, close: 148.91, volume: 51011300 },
  { time: '2023-02-23', open: 150.09, high: 150.34, low: 147.24, close: 149.40, volume: 48394200 },
  { time: '2023-02-24', open: 147.11, high: 147.19, low: 145.72, close: 146.71, volume: 55469600 },
  { time: '2023-02-27', open: 147.71, high: 149.17, low: 147.45, close: 147.92, volume: 44998500 },
  { time: '2023-02-28', open: 147.05, high: 149.08, low: 146.83, close: 147.41, volume: 50547000 },
  { time: '2023-03-01', open: 146.83, high: 147.23, low: 145.01, close: 145.31, volume: 55479000 },
  { time: '2023-03-02', open: 144.38, high: 146.71, low: 143.90, close: 145.91, volume: 52238800 },
  { time: '2023-03-03', open: 148.04, high: 151.11, low: 147.33, close: 151.03, volume: 70632400 },
  { time: '2023-03-06', open: 153.79, high: 156.30, low: 153.46, close: 153.83, volume: 87276300 },
  { time: '2023-03-07', open: 153.70, high: 154.03, low: 151.13, close: 151.60, volume: 56182000 },
  { time: '2023-03-08', open: 152.81, high: 153.47, low: 151.83, close: 152.87, volume: 47204800 },
  { time: '2023-03-09', open: 153.56, high: 154.54, low: 150.23, close: 150.59, volume: 53644500 },
  { time: '2023-03-10', open: 150.21, high: 150.94, low: 147.61, close: 148.50, volume: 68372400 },
  { time: '2023-03-13', open: 147.81, high: 153.14, low: 147.70, close: 150.47, volume: 84457700 },
  { time: '2023-03-14', open: 151.28, high: 153.40, low: 150.10, close: 152.59, volume: 73695100 },
  { time: '2023-03-15', open: 151.19, high: 153.25, low: 149.92, close: 152.99, volume: 77167900 },
  { time: '2023-03-16', open: 152.16, high: 156.46, low: 151.64, close: 155.85, volume: 76161100 },
  { time: '2023-03-17', open: 156.08, high: 156.74, low: 154.28, close: 155.00, volume: 98944600 },
  { time: '2023-03-20', open: 155.07, high: 157.82, low: 154.15, close: 157.40, volume: 73827000 },
  { time: '2023-03-21', open: 157.32, high: 159.40, low: 156.54, close: 159.28, volume: 73922000 },
  { time: '2023-03-22', open: 159.30, high: 162.14, low: 157.81, close: 157.83, volume: 75633200 },
  { time: '2023-03-23', open: 158.83, high: 161.55, low: 158.42, close: 158.93, volume: 67622100 },
  { time: '2023-03-24', open: 158.86, high: 160.34, low: 157.85, close: 160.25, volume: 59196500 },
  { time: '2023-03-27', open: 159.94, high: 160.77, low: 157.87, close: 158.28, volume: 52390300 },
  { time: '2023-03-28', open: 157.97, high: 158.49, low: 155.98, close: 157.65, volume: 45992200 },
  { time: '2023-03-29', open: 159.37, high: 165.00, low: 159.35, close: 164.90, volume: 78817400 },
  { time: '2023-03-30', open: 164.89, high: 165.00, low: 162.77, close: 162.88, volume: 61214200 },
  { time: '2023-03-31', open: 163.84, high: 165.00, low: 163.07, close: 164.90, volume: 68749800 }
];

// Generate intraday data based on daily data for demonstration
const generateIntradayData = (dailyData, interval) => {
  const intradayData = [];
  
  // Sort the daily data by date first
  const sortedDailyData = [...dailyData].sort((a, b) => 
    new Date(a.time).getTime() - new Date(b.time).getTime()
  );
  
  // For each day in daily data, create multiple intraday candles
  sortedDailyData.forEach(dayCandle => {
    const dayStart = new Date(dayCandle.time);
    // Market hours 9:30 AM to 4:00 PM (6.5 hours)
    dayStart.setHours(9, 30, 0, 0);
    
    // Calculate number of candles per day based on interval
    const candlesPerDay = interval === '1min' ? 390 : // 6.5 hours * 60 minutes
                         interval === '5min' ? 78 :  // 6.5 hours * 12 (5-min intervals)
                         1; // Default to 1 for daily
    
    // Generate price variation based on the daily high-low range
    const priceRange = dayCandle.high - dayCandle.low;
    let currentPrice = dayCandle.open;
    
    const dailyCandles = [];
    
    for (let i = 0; i < candlesPerDay; i++) {
      const candleTime = new Date(dayStart);
      
      // Add minutes based on interval and index
      if (interval === '1min') {
        candleTime.setMinutes(candleTime.getMinutes() + i);
      } else if (interval === '5min') {
        candleTime.setMinutes(candleTime.getMinutes() + (i * 5));
      }
      
      // Generate random price action within the day's range
      const volatility = priceRange * 0.2; // 20% of the day's range
      const movement = (Math.random() - 0.5) * volatility;
      
      // Make sure the price stays within the day's range
      currentPrice = Math.min(dayCandle.high, Math.max(dayCandle.low, currentPrice + movement));
      
      // Generate OHLC values for this candle
      const open = currentPrice;
      const high = open + (Math.random() * volatility * 0.5);
      const low = open - (Math.random() * volatility * 0.5);
      const close = low + (Math.random() * (high - low));
      
      // Create a properly formatted ISO datetime string
      const timeStr = candleTime.toISOString().replace('T', ' ').split('.')[0];
      
      // Add the candle to our data array
      dailyCandles.push({
        time: timeStr,
        open: open,
        high: Math.max(open, close, high),
        low: Math.min(open, close, low),
        close: close,
        volume: Math.floor(dayCandle.volume / candlesPerDay)
      });
      
      // Update current price for next candle
      currentPrice = close;
    }
    
    // Add this day's candles to the result
    intradayData.push(...dailyCandles);
  });
  
  // Ensure the candles are sorted by time
  return intradayData.sort((a, b) => 
    new Date(a.time).getTime() - new Date(b.time).getTime()
  );
};

// Generate monthly data by aggregating daily data
const generateMonthlyData = (dailyData) => {
  const monthlyData = [];
  let currentMonth = null;
  let currentMonthCandle = null;
  
  // Sort the daily data by date first
  const sortedDailyData = [...dailyData].sort((a, b) => 
    new Date(a.time).getTime() - new Date(b.time).getTime()
  );
  
  sortedDailyData.forEach(dayCandle => {
    const month = dayCandle.time.substring(0, 7); // YYYY-MM format
    
    if (month !== currentMonth) {
      // Save previous month's candle if it exists
      if (currentMonthCandle) {
        monthlyData.push(currentMonthCandle);
      }
      
      // Start a new month
      currentMonth = month;
      currentMonthCandle = {
        time: month + '-01', // First day of month
        open: dayCandle.open,
        high: dayCandle.high,
        low: dayCandle.low,
        close: dayCandle.close,
        volume: dayCandle.volume
      };
    } else {
      // Update existing month
      currentMonthCandle.high = Math.max(currentMonthCandle.high, dayCandle.high);
      currentMonthCandle.low = Math.min(currentMonthCandle.low, dayCandle.low);
      currentMonthCandle.close = dayCandle.close; // Last day's close becomes month's close
      currentMonthCandle.volume += dayCandle.volume;
    }
  });
  
  // Add the last month if it exists
  if (currentMonthCandle) {
    monthlyData.push(currentMonthCandle);
  }
  
  // Sort monthly data by time to ensure proper order
  return monthlyData.sort((a, b) => 
    new Date(a.time).getTime() - new Date(b.time).getTime()
  );
};

// Get timeframes
const getAvailableTimeframes = () => {
  return [
    { value: '1min', label: '1 Minute' },
    { value: '5min', label: '5 Minutes' },
    { value: '1day', label: 'Daily' },
    { value: '1month', label: 'Monthly' }
  ];
};

// For real-world use, we'd fetch data from an API
// This is a placeholder for demonstration purposes
const fetchStockData = async (symbol, timeframe = '1day', limit = 100) => {
  // In a real application, this would make an API call to a financial data provider
  // For example:
  // const response = await fetch(`https://api.example.com/stocks/${symbol}?timeframe=${timeframe}&limit=${limit}`);
  // const data = await response.json();
  // return formatData(data);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // For now, we'll return our sample data based on timeframe
  let data;
  
  switch (timeframe) {
    case '1min':
      data = generateIntradayData(aaplDailyData.slice(-10), '1min'); // Last 10 days of 1-min data
      break;
    case '5min':
      data = generateIntradayData(aaplDailyData.slice(-20), '5min'); // Last 20 days of 5-min data
      break;
    case '1month':
      data = generateMonthlyData(aaplDailyData);
      break;
    case '1day':
    default:
      data = aaplDailyData;
  }
  
  return formatData(data);
};

// Format the data for TradingView charts
const formatData = (data) => {
  // Convert dates to timestamps and create formatted data
  const formattedData = data.map(candle => ({
    time: Math.floor(new Date(candle.time).getTime() / 1000),
    open: candle.open,
    high: candle.high,
    low: candle.low,
    close: candle.close,
    volume: candle.volume
  }));
  
  // Sort the data by timestamp in ascending order to fix the error
  formattedData.sort((a, b) => a.time - b.time);
  
  return formattedData;
};

// Get available symbols
const getAvailableSymbols = () => {
  return [
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'MSFT', name: 'Microsoft Corporation' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.' },
    { symbol: 'META', name: 'Meta Platforms Inc.' },
    { symbol: 'TSLA', name: 'Tesla Inc.' },
    { symbol: 'NFLX', name: 'Netflix Inc.' },
    { symbol: 'NVDA', name: 'NVIDIA Corporation' }
  ];
};

// Get candle data for a specific symbol and timeframe
const getCandleData = async (symbol, timeframe) => {
  try {
    const data = await fetchStockData(symbol, timeframe);
    if (!data || data.length === 0) {
      console.error('No data available for', symbol, timeframe);
      return [];
    }
    return data;
  } catch (error) {
    console.error('Error fetching candle data:', error);
    throw error;
  }
};

export default {
  fetchStockData,
  getAvailableSymbols,
  getAvailableTimeframes,
  getCandleData
}; 