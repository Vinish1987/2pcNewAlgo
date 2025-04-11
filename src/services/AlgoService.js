/**
 * Algo Trading Service
 * Implements the same logic as the Pine Script indicator in JavaScript
 */

// Calculate EMA
const calculateEMA = (data, period) => {
  if (!data || data.length === 0) return [];
  
  const k = 2 / (period + 1);
  const emaValues = [];
  let ema;
  
  // Calculate SMA for first value
  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += data[i].close;
  }
  ema = sum / period;
  emaValues.push(ema);
  
  // Calculate EMA for remaining values
  for (let i = period; i < data.length; i++) {
    ema = (data[i].close - ema) * k + ema;
    emaValues.push(ema);
  }
  
  return emaValues;
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

// Generate trading signals based on the algorithm
export const generateSignals = (data, options = {}) => {
  if (!data || data.length === 0) return { signals: [], indicators: {} };
  
  const {
    ema1Length = 9,
    ema2Length = 21,
    rsiLength = 14,
    rsiOverbought = 70,
    rsiOversold = 30
  } = options;
  
  // Calculate indicators
  const ema1Values = calculateEMA(data, ema1Length);
  const ema2Values = calculateEMA(data, ema2Length);
  const rsiValues = calculateRSI(data, rsiLength);
  
  // Format indicators data for chart display
  const ema1Data = data.slice(ema1Length - 1).map((candle, i) => ({
    time: candle.time,
    value: ema1Values[i]
  }));
  
  const ema2Data = data.slice(ema2Length - 1).map((candle, i) => ({
    time: candle.time,
    value: ema2Values[i]
  }));
  
  // Generate signals
  const signals = [];
  const offset = Math.max(ema1Length, ema2Length, rsiLength) - 1;
  
  for (let i = offset + 1; i < data.length; i++) {
    const ema1Index = i - (ema1Length - 1);
    const ema2Index = i - (ema2Length - 1);
    const rsiIndex = i - (rsiLength - 1);
    
    if (ema1Index < 0 || ema2Index < 0 || rsiIndex < 0) continue;
    
    const ema1 = ema1Values[ema1Index];
    const ema2 = ema2Values[ema2Index];
    const rsi = rsiValues[rsiIndex];
    const prevRsi = rsiValues[rsiIndex - 1];
    
    const bullishTrend = ema1 > ema2 && rsi > 50;
    const bearishTrend = ema1 < ema2 && rsi < 50;
    
    // Buy signal: Bullish trend and RSI crosses above 50
    if (bullishTrend && prevRsi < 50 && rsi > 50) {
      signals.push({
        time: data[i].time,
        type: 'buy',
        price: data[i].close,
        ema1: ema1,
        ema2: ema2,
        rsi: rsi
      });
    }
    
    // Sell signal: Bearish trend and RSI crosses below 50
    if (bearishTrend && prevRsi > 50 && rsi < 50) {
      signals.push({
        time: data[i].time,
        type: 'sell',
        price: data[i].close,
        ema1: ema1,
        ema2: ema2,
        rsi: rsi
      });
    }
  }
  
  return {
    signals,
    indicators: {
      ema1: ema1Data,
      ema2: ema2Data
    }
  };
};

// Backtesting function to evaluate the algorithm
export const backtest = (data, initialCapital = 10000, options = {}) => {
  const { signals } = generateSignals(data, options);
  
  let capital = initialCapital;
  let position = 0;
  let entryPrice = 0;
  const trades = [];
  
  signals.forEach(signal => {
    if (signal.type === 'buy' && position === 0) {
      // Buy logic
      position = Math.floor(capital / signal.price);
      entryPrice = signal.price;
      capital -= position * signal.price;
      trades.push({
        type: 'buy',
        time: signal.time,
        price: signal.price,
        position,
        remaining: capital
      });
    } else if (signal.type === 'sell' && position > 0) {
      // Sell logic
      capital += position * signal.price;
      const profitLoss = ((signal.price - entryPrice) / entryPrice) * 100;
      trades.push({
        type: 'sell',
        time: signal.time,
        price: signal.price,
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

export default {
  generateSignals,
  backtest
}; 