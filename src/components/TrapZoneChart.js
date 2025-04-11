import React, { useEffect, useRef, useState, useMemo } from 'react';
import { createChart } from 'lightweight-charts';
import styled from 'styled-components';

const ChartContainer = styled.div`
  width: 100%;
  height: 500px;
`;

const ErrorMessage = styled.div`
  color: #ef5350;
  background: rgba(239, 83, 80, 0.1);
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 10px;
`;

// The lower component displays the trap zone indicator
const TrapZoneChart = ({ data, rsiData, signals, zoneBoundaries }) => {
  const chartContainerRef = useRef();
  const chartRef = useRef();
  const [error, setError] = useState(null);

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => a.time - b.time);
  }, [data]);

  const sortedRsiData = useMemo(() => {
    return [...rsiData].sort((a, b) => a.time - b.time);
  }, [rsiData]);

  useEffect(() => {
    if (!sortedData || sortedData.length === 0 || !sortedRsiData || sortedRsiData.length === 0) return;
    
    try {
      // Clean up previous chart instance
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
      
      // Create chart
      const chart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: 500,
        layout: {
          background: { color: '#253248' },
          textColor: '#DDD',
        },
        grid: {
          vertLines: { color: '#2B2B43' },
          horzLines: { color: '#2B2B43' },
        },
        timeScale: {
          borderColor: '#485c7b',
        },
      });
      
      chartRef.current = chart;
      
      // Create dual charts (price chart on top, RSI-HA chart on bottom)
      const mainSeries = chart.addCandlestickSeries({
        upColor: '#26a69a',
        downColor: '#ef5350',
        borderVisible: false,
        wickUpColor: '#26a69a',
        wickDownColor: '#ef5350',
        title: 'Price',
        priceScaleId: 'price',
      });
      
      // Configure price scale for the main price series
      chart.priceScale('price').applyOptions({
        scaleMargins: {
          top: 0.1,
          bottom: 0.4, // Make room for the RSI panel
        },
        borderVisible: true,
      });
      
      // Add the price data
      mainSeries.setData(sortedData);
      
      // Create RSI-HA series
      const rsiHASeries = chart.addCandlestickSeries({
        upColor: '#26a69a',
        downColor: '#ef5350',
        borderVisible: false,
        wickUpColor: '#26a69a',
        wickDownColor: '#ef5350',
        priceScaleId: 'rsi',
        title: 'VINISH TRAP ZONE',
      });
      
      // Configure the RSI price scale
      chart.priceScale('rsi').applyOptions({
        scaleMargins: {
          top: 0.7, // Position it in the lower part of the chart
          bottom: 0.05,
        },
        borderVisible: true,
        drawTicks: false,
      });
      
      // Set the RSI-HA data
      rsiHASeries.setData(sortedRsiData);
      
      // Add trap zone levels
      if (zoneBoundaries) {
        // CE Trap
        const upperTrapLine = chart.addLineSeries({
          color: 'rgba(255, 0, 0, 0.5)',
          lineWidth: 1,
          priceScaleId: 'rsi',
          title: 'CE TRAP',
          lastValueVisible: true,
        });
        
        upperTrapLine.setData(
          sortedData.map(candle => ({ time: candle.time, value: zoneBoundaries.upperTrap }))
        );
        
        // CE Trap Extreme
        const upperExtremeLine = chart.addLineSeries({
          color: 'rgba(255, 0, 0, 0.8)',
          lineWidth: 1,
          priceScaleId: 'rsi',
          title: 'CE Extreme',
          lastValueVisible: true,
        });
        
        upperExtremeLine.setData(
          sortedData.map(candle => ({ time: candle.time, value: zoneBoundaries.upperExtreme }))
        );
        
        // PE Trap
        const lowerTrapLine = chart.addLineSeries({
          color: 'rgba(0, 128, 0, 0.5)',
          lineWidth: 1,
          priceScaleId: 'rsi',
          title: 'PE TRAP',
          lastValueVisible: true,
        });
        
        lowerTrapLine.setData(
          sortedData.map(candle => ({ time: candle.time, value: zoneBoundaries.lowerTrap }))
        );
        
        // PE Trap Extreme
        const lowerExtremeLine = chart.addLineSeries({
          color: 'rgba(0, 128, 0, 0.8)',
          lineWidth: 1,
          priceScaleId: 'rsi',
          title: 'PE Extreme',
          lastValueVisible: true,
        });
        
        lowerExtremeLine.setData(
          sortedData.map(candle => ({ time: candle.time, value: zoneBoundaries.lowerExtreme }))
        );
        
        // NTZ Line (Zero)
        const ntzLine = chart.addLineSeries({
          color: 'rgba(255, 165, 0, 0.8)',
          lineWidth: 1,
          lineStyle: 2, // Dashed
          priceScaleId: 'rsi',
          title: 'NTZ',
          lastValueVisible: true,
        });
        
        ntzLine.setData(
          sortedData.map(candle => ({ time: candle.time, value: 0 }))
        );
      }
      
      // Add signals if available
      if (signals && signals.length > 0) {
        const buyMarkers = [];
        const sellMarkers = [];
        
        // Sort signals by time
        const sortedSignals = [...signals].sort((a, b) => a.time - b.time);
        
        sortedSignals.forEach(signal => {
          if (signal.type === 'buy') {
            buyMarkers.push({
              time: signal.time,
              position: 'belowBar',
              color: '#26a69a',
              shape: 'arrowUp',
              text: 'PE TRAP',
            });
          } else if (signal.type === 'sell') {
            sellMarkers.push({
              time: signal.time,
              position: 'aboveBar',
              color: '#ef5350',
              shape: 'arrowDown',
              text: 'CE TRAP',
            });
          } else if (signal.type === 'strongBuy') {
            buyMarkers.push({
              time: signal.time,
              position: 'belowBar',
              color: '#00ff00',
              shape: 'arrowUp',
              text: 'PE EXTREME',
            });
          } else if (signal.type === 'strongSell') {
            sellMarkers.push({
              time: signal.time,
              position: 'aboveBar',
              color: '#ff0000',
              shape: 'arrowDown',
              text: 'CE EXTREME',
            });
          }
        });
        
        mainSeries.setMarkers([...buyMarkers, ...sellMarkers]);
      }
      
      // Handle resize
      const handleResize = () => {
        requestAnimationFrame(() => {
          chart.applyOptions({
            width: chartContainerRef.current.clientWidth,
          });
        });
      };
      
      window.addEventListener('resize', handleResize);
      
      // Clear previous error if successful
      setError(null);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        chart.remove();
      };
    } catch (err) {
      console.error("Chart error:", err);
      setError(`Error rendering chart: ${err.message}`);
    }
  }, [sortedData, sortedRsiData, signals, zoneBoundaries]);
  
  return (
    <>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <ChartContainer ref={chartContainerRef} />
    </>
  );
};

export default TrapZoneChart; 