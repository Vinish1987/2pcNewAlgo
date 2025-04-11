import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';
import styled from 'styled-components';

const ChartContainer = styled.div`
  width: 100%;
  height: 400px;
`;

const Chart = ({ data, signals }) => {
  const chartContainerRef = useRef();
  const chartRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;
    
    // Create chart
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
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
    
    // Add candlestick series
    const candleSeries = chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });
    
    candleSeries.setData(data);
    
    // Add EMA lines
    const ema9Series = chart.addLineSeries({
      color: '#2196F3',
      lineWidth: 2,
      title: 'EMA 9',
    });
    
    const ema21Series = chart.addLineSeries({
      color: '#FF5722',
      lineWidth: 2,
      title: 'EMA 21',
    });
    
    // Calculate EMAs
    const ema9Data = calculateEMA(data, 9);
    const ema21Data = calculateEMA(data, 21);
    
    ema9Series.setData(ema9Data);
    ema21Series.setData(ema21Data);
    
    // Add signals if available
    if (signals && signals.length > 0) {
      const buyMarkers = [];
      const sellMarkers = [];
      
      signals.forEach(signal => {
        if (signal.type === 'buy') {
          buyMarkers.push({
            time: signal.time,
            position: 'belowBar',
            color: '#2196F3',
            shape: 'arrowUp',
            text: 'BUY',
          });
        } else if (signal.type === 'sell') {
          sellMarkers.push({
            time: signal.time,
            position: 'aboveBar',
            color: '#FF5722',
            shape: 'arrowDown',
            text: 'SELL',
          });
        }
      });
      
      candleSeries.setMarkers([...buyMarkers, ...sellMarkers]);
    }
    
    // Handle resize
    const handleResize = () => {
      chart.applyOptions({
        width: chartContainerRef.current.clientWidth,
      });
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [data, signals]);
  
  return <ChartContainer ref={chartContainerRef} />;
};

// Helper function to calculate EMA
function calculateEMA(data, period) {
  if (!data || data.length === 0) return [];
  
  const k = 2 / (period + 1);
  let emaData = [];
  let sum = 0;
  
  // Calculate SMA for the first period
  for (let i = 0; i < period; i++) {
    sum += data[i].close;
  }
  
  let ema = sum / period;
  
  // Calculate EMA starting from the period
  for (let i = 0; i < data.length; i++) {
    if (i >= period) {
      ema = (data[i].close - ema) * k + ema;
    } else if (i === period - 1) {
      ema = sum / period;
    } else {
      ema = null;
    }
    
    if (ema !== null) {
      emaData.push({
        time: data[i].time,
        value: ema,
      });
    }
  }
  
  return emaData;
}

export default Chart; 