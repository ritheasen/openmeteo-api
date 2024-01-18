import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns'; // Import the date adapter

// Register the required plugins
Chart.register(...registerables);

interface WeatherChartProps {
  weatherData: {
    hourly: {
      time: Date[];
      temperature2m: number[];
      rain: number[];
    };
  };
}

const WeatherChart: React.FC<WeatherChartProps> = ({ weatherData }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d') as CanvasRenderingContext2D;

      // Destroy existing chart instance if it exists
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      chartInstanceRef.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: weatherData.hourly.time,
          datasets: [
            {
              label: 'Temperature (°C)',
              data: weatherData.hourly.temperature2m,
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 2,
              fill: false,
            },
            {
              label: 'Rain (mm)',
              data: weatherData.hourly.rain,
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 2,
              fill: false,
            },
          ],
        },
        options: {
          scales: {
            x: {
              type: 'time',
              time: {
                unit: 'hour',
              },
            },
          },
        },
      });
    }
  }, [weatherData]);

  return <canvas ref={chartRef} width={600} height={400} />;
};

export default WeatherChart;
