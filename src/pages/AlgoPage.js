import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Chart from '../components/Chart';
import AlgoService from '../services/AlgoService';

// Sample data for demonstration
import sampleData from '../data/sampleData';

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

const AlgoPage = () => {
  const [chartData, setChartData] = useState([]);
  const [signals, setSignals] = useState([]);
  const [backtestResults, setBacktestResults] = useState(null);
  const [algoParams, setAlgoParams] = useState({
    ema1Length: 9,
    ema2Length: 21,
    rsiLength: 14,
    rsiOverbought: 70,
    rsiOversold: 30,
    initialCapital: 20000
  });

  // Load sample data on component mount
  useEffect(() => {
    setChartData(sampleData);
    runBacktest(sampleData, algoParams);
  }, []);

  const handleParamChange = (e) => {
    const { name, value } = e.target;
    setAlgoParams({
      ...algoParams,
      [name]: parseFloat(value)
    });
  };

  const runBacktest = (data, params) => {
    // Generate signals and backtest results
    const { signals, indicators } = AlgoService.generateSignals(data, params);
    const backtestResults = AlgoService.backtest(data, params.initialCapital, params);
    
    setSignals(signals);
    setBacktestResults(backtestResults);
  };

  const handleRunBacktest = () => {
    runBacktest(chartData, algoParams);
  };

  return (
    <PageContainer>
      <Header>
        <Title>
          <Logo>2PC</Logo>
          <span>2 PC Algo</span>
        </Title>
        <Balance>Zerodha Balance: Rs 20,000</Balance>
      </Header>

      <ChartContainer>
        <Chart data={chartData} signals={signals} />
      </ChartContainer>

      <ControlsSection>
        <ControlCard>
          <CardTitle>Algorithm Parameters</CardTitle>
          <InputGroup>
            <Label>EMA 1 Length</Label>
            <Input
              type="number"
              name="ema1Length"
              value={algoParams.ema1Length}
              onChange={handleParamChange}
            />
          </InputGroup>
          <InputGroup>
            <Label>EMA 2 Length</Label>
            <Input
              type="number"
              name="ema2Length"
              value={algoParams.ema2Length}
              onChange={handleParamChange}
            />
          </InputGroup>
          <InputGroup>
            <Label>RSI Length</Label>
            <Input
              type="number"
              name="rsiLength"
              value={algoParams.rsiLength}
              onChange={handleParamChange}
            />
          </InputGroup>
          <InputGroup>
            <Label>RSI Overbought Level</Label>
            <Input
              type="number"
              name="rsiOverbought"
              value={algoParams.rsiOverbought}
              onChange={handleParamChange}
            />
          </InputGroup>
          <InputGroup>
            <Label>RSI Oversold Level</Label>
            <Input
              type="number"
              name="rsiOversold"
              value={algoParams.rsiOversold}
              onChange={handleParamChange}
            />
          </InputGroup>
          <Button onClick={handleRunBacktest}>Run Backtest</Button>
        </ControlCard>

        <ControlCard>
          <CardTitle>Backtest Results</CardTitle>
          {backtestResults ? (
            <div>
              <div>Initial Capital: ₹{backtestResults.initialCapital.toFixed(2)}</div>
              <div>Final Value: ₹{backtestResults.finalValue.toFixed(2)}</div>
              <div>Total Return: {backtestResults.totalReturn.toFixed(2)}%</div>
              <div>Total Trades: {backtestResults.trades.length}</div>
            </div>
          ) : (
            <div>Run a backtest to see results</div>
          )}
        </ControlCard>
      </ControlsSection>

      <ResultsSection>
        <CardTitle>Recent Signals</CardTitle>
        {signals.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #485c7b' }}>Type</th>
                <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #485c7b' }}>Time</th>
                <th style={{ textAlign: 'right', padding: '8px', borderBottom: '1px solid #485c7b' }}>Price</th>
                <th style={{ textAlign: 'right', padding: '8px', borderBottom: '1px solid #485c7b' }}>EMA1</th>
                <th style={{ textAlign: 'right', padding: '8px', borderBottom: '1px solid #485c7b' }}>EMA2</th>
                <th style={{ textAlign: 'right', padding: '8px', borderBottom: '1px solid #485c7b' }}>RSI</th>
              </tr>
            </thead>
            <tbody>
              {signals.slice(-5).reverse().map((signal, index) => (
                <tr key={index}>
                  <td style={{ padding: '8px', color: signal.type === 'buy' ? '#26a69a' : '#ef5350' }}>
                    {signal.type.toUpperCase()}
                  </td>
                  <td style={{ padding: '8px' }}>{new Date(signal.time * 1000).toLocaleDateString()}</td>
                  <td style={{ textAlign: 'right', padding: '8px' }}>₹{signal.price.toFixed(2)}</td>
                  <td style={{ textAlign: 'right', padding: '8px' }}>{signal.ema1.toFixed(2)}</td>
                  <td style={{ textAlign: 'right', padding: '8px' }}>{signal.ema2.toFixed(2)}</td>
                  <td style={{ textAlign: 'right', padding: '8px' }}>{signal.rsi.toFixed(2)}</td>
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

export default AlgoPage; 