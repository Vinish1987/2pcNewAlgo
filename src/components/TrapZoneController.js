import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import TrapZoneChart from './TrapZoneChart';
import VinishTrapService from '../services/VinishTrapService';
import DataService from '../services/DataService';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const ControlsBar = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  background-color: #2a2e39;
  padding: 1rem;
  border-radius: 8px;
`;

const SelectGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Label = styled.label`
  color: #fff;
  font-size: 14px;
`;

const Select = styled.select`
  background-color: #1e222d;
  color: #fff;
  border: 1px solid #3a3f4b;
  border-radius: 4px;
  padding: 0.5rem;
  font-size: 14px;
`;

const TimeframeSelector = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const TimeframeButton = styled.button`
  background-color: ${(props) => (props.active ? '#2962ff' : '#1e222d')};
  color: #fff;
  border: 1px solid #3a3f4b;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${(props) => (props.active ? '#1e4bd8' : '#2a2e39')};
  }
`;

const ChartWrapper = styled.div`
  flex: 1;
  min-height: 500px;
`;

const LoadingIndicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 18px;
  color: #fff;
`;

const TrapZoneController = () => {
  const [chartData, setChartData] = useState([]);
  const [rsiData, setRsiData] = useState([]);
  const [signals, setSignals] = useState([]);
  const [zoneBoundaries, setZoneBoundaries] = useState(null);
  const [symbols] = useState([
    { value: 'AAPL', label: 'Apple Inc.' },
    { value: 'MSFT', label: 'Microsoft Corp.' },
    { value: 'GOOGL', label: 'Alphabet Inc.' },
    { value: 'AMZN', label: 'Amazon.com Inc.' },
    { value: 'TSLA', label: 'Tesla Inc.' },
  ]);
  const [timeframes] = useState([
    { value: '1min', label: '1m' },
    { value: '5min', label: '5m' },
    { value: '1day', label: '1D' },
    { value: '1month', label: '1M' },
  ]);
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  const [selectedTimeframe, setSelectedTimeframe] = useState('1day');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Trap zone parameters
  const algoParams = {
    lenCALLPUT: 14,
    smoothing: 1,
    upperTrap: 20,
    upperExtreme: 30,
    lowerTrap: -20,
    lowerExtreme: -30,
  };

  // Load data when symbol or timeframe changes
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get candle data
        const candleData = await DataService.getCandleData(
          selectedSymbol,
          selectedTimeframe
        );

        if (!candleData || candleData.length === 0) {
          setError('No data available for the selected symbol and timeframe');
          setIsLoading(false);
          return;
        }

        // Process data for the Vinish Trap Zone indicator
        const { rsiData, signals, zoneBoundaries } = VinishTrapService.generateTrapZones(
          candleData,
          algoParams
        );

        setChartData(candleData);
        setRsiData(rsiData);
        setSignals(signals);
        setZoneBoundaries(zoneBoundaries);
      } catch (error) {
        console.error('Error loading data:', error);
        setError(`Error loading data: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [selectedSymbol, selectedTimeframe, algoParams]);

  const handleSymbolChange = (e) => {
    setSelectedSymbol(e.target.value);
  };

  const handleTimeframeChange = (timeframe) => {
    setSelectedTimeframe(timeframe);
  };

  return (
    <Container>
      <ControlsBar>
        <SelectGroup>
          <Label>Symbol:</Label>
          <Select value={selectedSymbol} onChange={handleSymbolChange}>
            {symbols.map((symbol) => (
              <option key={symbol.value} value={symbol.value}>
                {symbol.label}
              </option>
            ))}
          </Select>
        </SelectGroup>
        <TimeframeSelector>
          {timeframes.map((timeframe) => (
            <TimeframeButton
              key={timeframe.value}
              active={selectedTimeframe === timeframe.value}
              onClick={() => handleTimeframeChange(timeframe.value)}
            >
              {timeframe.label}
            </TimeframeButton>
          ))}
        </TimeframeSelector>
      </ControlsBar>
      <ChartWrapper>
        {isLoading ? (
          <LoadingIndicator>Loading data...</LoadingIndicator>
        ) : error ? (
          <div style={{ color: '#ef5350', padding: '1rem' }}>{error}</div>
        ) : (
          <TrapZoneChart
            data={chartData}
            rsiData={rsiData}
            signals={signals}
            zoneBoundaries={zoneBoundaries}
          />
        )}
      </ChartWrapper>
    </Container>
  );
};

export default TrapZoneController; 