import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import TrapZoneChart from '../components/TrapZoneChart';
import VinishTrapService from '../services/VinishTrapService';
import DataService from '../services/DataService';

const PageContainer = styled.div`
  padding: 20px;
  background-color: #1e1e2d;
  color: #fff;
  min-height: 100vh;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 24px;
  display: flex;
  align-items: center;
`;

const Logo = styled.div`
  background-color: #00e676;
  color: #000;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 10px;
`;

const Balance = styled.div`
  background-color: rgba(255, 255, 255, 0.1);
  padding: 10px 15px;
  border-radius: 5px;
`;

const ChartContainer = styled.div`
  background-color: #253248;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
`;

const TimeframeSelector = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
`;

const TimeframeButton = styled.button`
  padding: 8px 15px;
  background-color: ${props => props.active ? '#00e676' : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.active ? '#000' : '#fff'};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  
  &:hover {
    background-color: ${props => props.active ? '#00e676' : 'rgba(255, 255, 255, 0.2)'};
  }
`;

const ControlsSection = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
`;

const ControlCard = styled.div`
  background-color: #253248;
  border-radius: 8px;
  padding: 20px;
  flex: 1;
`;

const CardTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 18px;
`;

const InputGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
  color: #ccc;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  background-color: #1e1e2d;
  border: 1px solid #485c7b;
  border-radius: 4px;
  color: #fff;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  background-color: #1e1e2d;
  border: 1px solid #485c7b;
  border-radius: 4px;
  color: #fff;
`;

const Button = styled.button`
  padding: 10px 15px;
  background-color: #00e676;
  color: #000;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  &:hover {
    background-color: #00c853;
  }
`;

const ResultsSection = styled.div`
  background-color: #253248;
  border-radius: 8px;
  padding: 20px;
`;

const VinishTrapPage = () => {
  const [chartData, setChartData] = useState([]);
  const [rsiData, setRsiData] = useState([]);
  const [signals, setSignals] = useState([]);
  const [zoneBoundaries, setZoneBoundaries] = useState(null);
  const [backtestResults, setBacktestResults] = useState(null);
  const [symbols, setSymbols] = useState([]);
  const [timeframes, setTimeframes] = useState([]);
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  const [selectedTimeframe, setSelectedTimeframe] = useState('1day');
  const [isLoading, setIsLoading] = useState(false);
  const [algoParams, setAlgoParams] = useState({
    lenCALLPUT: 14,
    smoothing: 1,
    upperTrap: 20,
    upperExtreme: 30,
    lowerTrap: -20,
    lowerExtreme: -30,
    initialCapital: 20000
  });

  // Load stock data and available symbols on component mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      // Load available symbols and timeframes
      const availableSymbols = DataService.getAvailableSymbols();
      const availableTimeframes = DataService.getAvailableTimeframes();
      setSymbols(availableSymbols);
      setTimeframes(availableTimeframes);
      
      // Load AAPL data with daily timeframe by default
      const data = await DataService.fetchStockData('AAPL', '1day');
      setChartData(data);
      
      // Run initial backtest
      runBacktest(data, algoParams);
      
      setIsLoading(false);
    };
    
    loadData();
  }, []);

  const handleParamChange = (e) => {
    const { name, value } = e.target;
    setAlgoParams({
      ...algoParams,
      [name]: parseFloat(value)
    });
  };

  const handleSymbolChange = async (e) => {
    const symbol = e.target.value;
    setSelectedSymbol(symbol);
    await loadChartData(symbol, selectedTimeframe);
  };

  const handleTimeframeChange = async (timeframe) => {
    setSelectedTimeframe(timeframe);
    await loadChartData(selectedSymbol, timeframe);
  };

  const loadChartData = async (symbol, timeframe) => {
    setIsLoading(true);
    
    const data = await DataService.fetchStockData(symbol, timeframe);
    setChartData(data);
    
    // Run backtest with new data
    runBacktest(data, algoParams);
    
    setIsLoading(false);
  };

  const runBacktest = (data, params) => {
    // Generate trap zones and signals
    const { candleData, signals, zoneBoundaries } = VinishTrapService.generateTrapZones(data, params);
    const backtestResults = VinishTrapService.backtest(data, params.initialCapital, params);
    
    setRsiData(candleData);
    setSignals(signals);
    setZoneBoundaries(zoneBoundaries);
    setBacktestResults(backtestResults);
  };

  const handleRunBacktest = () => {
    runBacktest(chartData, algoParams);
  };

  // Format the timeframe for display
  const formatTimeframe = (timeframe) => {
    const timeframeObj = timeframes.find(tf => tf.value === timeframe);
    return timeframeObj ? timeframeObj.label : timeframe;
  };

  return (
    <PageContainer>
      <Header>
        <Title>
          <Logo>2PC</Logo>
          <span>VINISH BUY SELL TRAP ZONE</span>
        </Title>
        <Balance>Zerodha Balance: Rs 20,000</Balance>
      </Header>

      <ChartContainer>
        <TimeframeSelector>
          {timeframes.map(timeframe => (
            <TimeframeButton 
              key={timeframe.value}
              active={selectedTimeframe === timeframe.value}
              onClick={() => handleTimeframeChange(timeframe.value)}
            >
              {timeframe.label}
            </TimeframeButton>
          ))}
        </TimeframeSelector>
        
        {isLoading ? (
          <div style={{ height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            Loading data...
          </div>
        ) : (
          <TrapZoneChart 
            data={chartData} 
            rsiData={rsiData} 
            signals={signals}
            zoneBoundaries={zoneBoundaries}
          />
        )}
      </ChartContainer>

      <ControlsSection>
        <ControlCard>
          <CardTitle>Stock Selection & Parameters</CardTitle>
          
          <InputGroup>
            <Label>Symbol</Label>
            <Select 
              value={selectedSymbol} 
              onChange={handleSymbolChange}
            >
              {symbols.map(symbol => (
                <option key={symbol.symbol} value={symbol.symbol}>
                  {symbol.symbol} - {symbol.name}
                </option>
              ))}
            </Select>
          </InputGroup>
          
          <InputGroup>
            <Label>CALLPUT Length</Label>
            <Input
              type="number"
              name="lenCALLPUT"
              value={algoParams.lenCALLPUT}
              onChange={handleParamChange}
            />
          </InputGroup>
          <InputGroup>
            <Label>Smoothing</Label>
            <Input
              type="number"
              name="smoothing"
              value={algoParams.smoothing}
              onChange={handleParamChange}
            />
          </InputGroup>
          <InputGroup>
            <Label>CE TRAP Level</Label>
            <Input
              type="number"
              name="upperTrap"
              value={algoParams.upperTrap}
              onChange={handleParamChange}
            />
          </InputGroup>
          <InputGroup>
            <Label>CE Trap Extreme Level</Label>
            <Input
              type="number"
              name="upperExtreme"
              value={algoParams.upperExtreme}
              onChange={handleParamChange}
            />
          </InputGroup>
          <InputGroup>
            <Label>PE TRAP Level</Label>
            <Input
              type="number"
              name="lowerTrap"
              value={algoParams.lowerTrap}
              onChange={handleParamChange}
            />
          </InputGroup>
          <InputGroup>
            <Label>PE Trap Extreme Level</Label>
            <Input
              type="number"
              name="lowerExtreme"
              value={algoParams.lowerExtreme}
              onChange={handleParamChange}
            />
          </InputGroup>
          <Button onClick={handleRunBacktest}>Run Backtest</Button>
        </ControlCard>

        <ControlCard>
          <CardTitle>
            Backtest Results for {selectedSymbol} ({formatTimeframe(selectedTimeframe)})
          </CardTitle>
          {backtestResults ? (
            <div>
              <div>Initial Capital: ₹{backtestResults.initialCapital.toFixed(2)}</div>
              <div>Final Value: ₹{backtestResults.finalValue.toFixed(2)}</div>
              <div>Total Return: {backtestResults.totalReturn.toFixed(2)}%</div>
              <div>Total Trades: {backtestResults.trades.length}</div>
              
              <div style={{ marginTop: '20px' }}>
                <h4 style={{ marginBottom: '10px' }}>Performance Metrics:</h4>
                {backtestResults.trades.length > 0 ? (
                  <>
                    <div>Win Rate: {calculateWinRate(backtestResults.trades).toFixed(2)}%</div>
                    <div>Avg Profit per Trade: {calculateAvgProfit(backtestResults.trades).toFixed(2)}%</div>
                    <div>Max Drawdown: {calculateMaxDrawdown(backtestResults.trades).toFixed(2)}%</div>
                  </>
                ) : (
                  <div>No trades generated</div>
                )}
              </div>
            </div>
          ) : (
            <div>Run a backtest to see results</div>
          )}
        </ControlCard>
      </ControlsSection>

      <ResultsSection>
        <CardTitle>
          Recent Signals for {selectedSymbol} ({formatTimeframe(selectedTimeframe)})
        </CardTitle>
        {signals.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #485c7b' }}>Type</th>
                <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #485c7b' }}>Zone</th>
                <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #485c7b' }}>Date</th>
                <th style={{ textAlign: 'right', padding: '8px', borderBottom: '1px solid #485c7b' }}>Price</th>
                <th style={{ textAlign: 'right', padding: '8px', borderBottom: '1px solid #485c7b' }}>RSI-HA</th>
              </tr>
            </thead>
            <tbody>
              {signals.slice(-10).reverse().map((signal, index) => (
                <tr key={index}>
                  <td style={{ 
                    padding: '8px', 
                    color: signal.type.includes('buy') ? '#26a69a' : '#ef5350',
                    fontWeight: signal.type.includes('strong') ? 'bold' : 'normal'
                  }}>
                    {signal.type.toUpperCase()}
                  </td>
                  <td style={{ padding: '8px' }}>{signal.zoneType}</td>
                  <td style={{ padding: '8px' }}>
                    {formatDate(signal.time, selectedTimeframe)}
                  </td>
                  <td style={{ textAlign: 'right', padding: '8px' }}>₹{signal.price.toFixed(2)}</td>
                  <td style={{ textAlign: 'right', padding: '8px' }}>{signal.rsiHA.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div>No signals generated yet</div>
        )}
      </ResultsSection>
    </PageContainer>
  );
};

// Format date based on timeframe
const formatDate = (timestamp, timeframe) => {
  const date = new Date(timestamp * 1000);
  
  if (timeframe === '1min' || timeframe === '5min') {
    return date.toLocaleString();
  } else if (timeframe === '1day') {
    return date.toLocaleDateString();
  } else if (timeframe === '1month') {
    // Format as Month Year (e.g., "Jan 2023")
    return date.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
  }
  
  return date.toLocaleDateString();
};

// Helper functions for backtest metrics
const calculateWinRate = (trades) => {
  if (trades.length === 0) return 0;
  
  const profitableTrades = trades.filter(trade => 
    trade.type === 'sell' && trade.profitLoss > 0
  ).length;
  
  return (profitableTrades / trades.filter(trade => trade.type === 'sell').length) * 100;
};

const calculateAvgProfit = (trades) => {
  const sellTrades = trades.filter(trade => trade.type === 'sell');
  if (sellTrades.length === 0) return 0;
  
  const totalProfit = sellTrades.reduce((sum, trade) => sum + trade.profitLoss, 0);
  return totalProfit / sellTrades.length;
};

const calculateMaxDrawdown = (trades) => {
  if (trades.length === 0) return 0;
  
  let maxDrawdown = 0;
  let peak = 0;
  
  trades.forEach(trade => {
    const currentValue = trade.remaining;
    
    if (currentValue > peak) {
      peak = currentValue;
    }
    
    const drawdown = ((peak - currentValue) / peak) * 100;
    
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
  });
  
  return maxDrawdown;
};

export default VinishTrapPage; 