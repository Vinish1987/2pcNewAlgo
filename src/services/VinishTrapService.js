/**
 * Vinish Buy Sell Trap Zone Service
 * JavaScript implementation of the Vinish's Pine Script indicator
 */

// Zero-centered RSI helper function (subtracts 50 from RSI)
const calculateZRSI = (data, period) => {
  if (!data || data.length === 0) return [];
  
  const rsiValues = calculateRSI(data, period);
  return rsiValues.map(value => value - 50);
};

// Calculate RSI
const calculateRSI = (data, period) => {
  if (!data || data.length < period + 1) return [];
  
  const rsiValues = [];
  const prices = data.map(candle => candle.close);
  
  let avgGain = 0;
  let avgLoss = 0;
  
  // Calculate first average gain and loss
  for (let i = 1; i <= period; i++) {
    const change = prices[i] - prices[i - 1];
    if (change >= 0) {
      avgGain += change;
    } else {
      avgLoss += Math.abs(change);
    }
  }
  
  avgGain /= period;
  avgLoss /= period;
  
  // Calculate RSI values
  let rs = avgGain / avgLoss;
  let rsi = 100 - (100 / (1 + rs));
  rsiValues.push(rsi);
  
  // Calculate remaining RSI values
  for (let i = period + 1; i < prices.length; i++) {
    const change = prices[i] - prices[i - 1];
    let currentGain = 0;
    let currentLoss = 0;
    
    if (change >= 0) {
      currentGain = change;
    } else {
      currentLoss = Math.abs(change);
    }
    
    avgGain = (avgGain * (period - 1) + currentGain) / period;
    avgLoss = (avgLoss * (period - 1) + currentLoss) / period;
    
    rs = avgGain / avgLoss;
    rsi = 100 - (100 / (1 + rs));
    rsiValues.push(rsi);
  }
  
  return rsiValues;
};

// RSI Heikin-Ashi generation function
const calculateRSIHeikinAshi = (data, period, smoothing = 1) => {
  if (!data || data.length < period + 1) return { open: [], high: [], low: [], close: [] };
  
  const results = {
    open: [],
    high: [],
    low: [],
    close: [],
    time: []
  };
  
  // Calculate ZRSI values for OHLC
  const closeZRSI = calculateZRSI(data.map(d => ({ close: d.close })), period);
  const highZRSI = calculateZRSI(data.map(d => ({ close: d.high })), period);
  const lowZRSI = calculateZRSI(data.map(d => ({ close: d.low })), period);
  
  // Offset the data to match Pine Script's indexing
  const startIndex = period;
  let prevOpen = null;
  
  for (let i = 0; i < data.length - startIndex; i++) {
    const currentIndex = i + startIndex;
    const candle = data[currentIndex];
    
    // Calculate values
    const currentCloseZRSI = closeZRSI[i];
    const currentHighZRSI = highZRSI[i];
    const currentLowZRSI = lowZRSI[i];
    
    // Previous close becomes current open (emulate Pine's nz() function)
    const currentOpenZRSI = i > 0 ? closeZRSI[i - 1] : currentCloseZRSI;
    
    // Make sure high is highest and low is lowest
    const adjustedHighZRSI = Math.max(currentHighZRSI, currentLowZRSI);
    const adjustedLowZRSI = Math.min(currentHighZRSI, currentLowZRSI);
    
    // HA calculation for close
    const haClose = (currentOpenZRSI + adjustedHighZRSI + adjustedLowZRSI + currentCloseZRSI) / 4;
    
    // HA calculation for open with smoothing
    let haOpen;
    if (prevOpen === null) {
      haOpen = (currentOpenZRSI + currentCloseZRSI) / 2;
    } else {
      haOpen = (prevOpen * smoothing + results.close[i - 1]) / (smoothing + 1);
    }
    prevOpen = haOpen;
    
    // HA calculation for high and low
    const haHigh = Math.max(adjustedHighZRSI, Math.max(haOpen, haClose));
    const haLow = Math.min(adjustedLowZRSI, Math.min(haOpen, haClose));
    
    // Store results
    results.open.push(haOpen);
    results.high.push(haHigh);
    results.low.push(haLow);
    results.close.push(haClose);
    results.time.push(candle.time);
  }
  
  return results;
};

// Generate trap zones and trading signals
export const generateTrapZones = (data, options = {}) => {
  if (!data || data.length === 0) return { rsiData: [], signals: [], zoneBoundaries: null };
  
  try {
    // Ensure data is sorted by time
    const sortedData = [...data].sort((a, b) => a.time - b.time);
    
    const {
      lenCALLPUT = 14,
      smoothing = 1,
      upperTrap = 20,
      upperExtreme = 30,
      lowerTrap = -20,
      lowerExtreme = -30
    } = options;
    
    // Calculate RSI Heikin-Ashi
    const rsiHAData = calculateRSIHeikinAshi(sortedData, lenCALLPUT, smoothing);
    
    // Format candlestick data for chart
    const rsiData = [];
    for (let i = 0; i < rsiHAData.open.length; i++) {
      rsiData.push({
        time: rsiHAData.time[i],
        open: rsiHAData.open[i],
        high: rsiHAData.high[i],
        low: rsiHAData.low[i],
        close: rsiHAData.close[i],
        color: rsiHAData.close[i] > rsiHAData.open[i] ? 'teal' : 'red'
      });
    }
    
    // Sort the candle data to ensure it's in order
    const sortedRsiData = rsiData.sort((a, b) => a.time - b.time);
    
    // Generate signals
    const signals = [];
    for (let i = 1; i < sortedRsiData.length; i++) {
      const current = sortedRsiData[i];
      const prev = sortedRsiData[i - 1];
      const originalIndex = i + lenCALLPUT;
      
      // Make sure we don't access beyond the original data array
      if (originalIndex >= sortedData.length) continue;
      
      const originalPrice = sortedData[originalIndex].close;
      
      // CE Trap (buy) signal: Candle moves from below lower trap to above it
      if (prev.close < lowerTrap && current.close > lowerTrap) {
        signals.push({
          time: current.time,
          type: 'buy',
          price: originalPrice,
          zoneType: 'PE_TRAP_EXIT',
          rsiHA: current.close
        });
      }
      
      // PE Trap (sell) signal: Candle moves from above upper trap to below it
      if (prev.close > upperTrap && current.close < upperTrap) {
        signals.push({
          time: current.time,
          type: 'sell',
          price: originalPrice,
          zoneType: 'CE_TRAP_EXIT',
          rsiHA: current.close
        });
      }
      
      // Extreme zone signals
      if (prev.close < lowerExtreme && current.close > lowerExtreme) {
        signals.push({
          time: current.time,
          type: 'strongBuy',
          price: originalPrice,
          zoneType: 'PE_EXTREME_EXIT',
          rsiHA: current.close
        });
      }
      
      if (prev.close > upperExtreme && current.close < upperExtreme) {
        signals.push({
          time: current.time,
          type: 'strongSell',
          price: originalPrice,
          zoneType: 'CE_EXTREME_EXIT',
          rsiHA: current.close
        });
      }
    }
    
    // Sort signals by time
    const sortedSignals = signals.sort((a, b) => a.time - b.time);
    
    // Create zone boundaries for display
    const zoneBoundaries = {
      upperTrap,
      upperExtreme,
      lowerTrap,
      lowerExtreme
    };
    
    return {
      rsiData: sortedRsiData,
      signals: sortedSignals,
      zoneBoundaries
    };
  } catch (error) {
    console.error("Error generating trap zones:", error);
    return { rsiData: [], signals: [], zoneBoundaries: null };
  }
};

// Backtest the trap zone strategy
export const backtest = (data, initialCapital = 10000, options = {}) => {
  const { signals } = generateTrapZones(data, options);
  
  let capital = initialCapital;
  let position = 0;
  let entryPrice = 0;
  const trades = [];
  
  signals.forEach(signal => {
    // Only take regular buy/sell signals, not the extreme ones 
    // unless you want to include them as well
    if ((signal.type === 'buy' || signal.type === 'strongBuy') && position === 0) {
      // Buy logic
      position = Math.floor(capital / signal.price);
      entryPrice = signal.price;
      capital -= position * signal.price;
      trades.push({
        type: signal.type,
        time: signal.time,
        price: signal.price,
        zoneType: signal.zoneType,
        position,
        remaining: capital
      });
    } else if ((signal.type === 'sell' || signal.type === 'strongSell') && position > 0) {
      // Sell logic
      capital += position * signal.price;
      const profitLoss = ((signal.price - entryPrice) / entryPrice) * 100;
      trades.push({
        type: signal.type,
        time: signal.time,
        price: signal.price,
        zoneType: signal.zoneType,
        position,
        remaining: capital,
        profitLoss
      });
      position = 0;
    }
  });
  
  // Calculate final portfolio value
  const finalValue = capital + (position > 0 ? position * data[data.length - 1].close : 0);
  const totalReturn = ((finalValue - initialCapital) / initialCapital) * 100;
  
  return {
    initialCapital,
    finalValue,
    totalReturn,
    trades
  };
};

// Assign the instance to a variable before exporting
const vinishTrapServiceInstance = {
  calculateZRSI,
  calculateRSI,
  calculateRSIHeikinAshi,
  generateTrapZones
};
export default vinishTrapServiceInstance; 