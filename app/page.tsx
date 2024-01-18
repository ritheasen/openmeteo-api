"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import { fetchWeatherApi } from 'openmeteo';
import { Chart } from "chart.js";
import { useEffect, useState } from "react"
import WeatherChart from '@/components/chartjs';
import axios from 'axios';

export default function Home() {

  console.log("hellow world");
  
  const [weatherData, setWeatherData] = useState<any>();
  const [locationInput, setLocationInput] = useState<string>("");
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);

  const [myLatitude, setLatitude] = useState<number>(0);
  const [myLongitude, setLongitude] = useState<number>(0);


  const handleSearch = async () => {
    try {
      console.log(myLatitude, myLongitude);

      const params = {
        "latitude": myLatitude,
        "longitude": myLongitude,
        "hourly": ["temperature_2m", "rain"]
      };

      const url = "https://api.open-meteo.com/v1/forecast";
      const responses = await fetchWeatherApi(url, params);
      
      const range = (start: number, stop: number, step: number) =>
        Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);
      
      const response = responses[0];
      
      // Attributes for timezone and location
      const utcOffsetSeconds = response.utcOffsetSeconds();
      const timezone = response.timezone();
      const timezoneAbbreviation = response.timezoneAbbreviation();
      const latitude = response.latitude();
      const longitude = response.longitude();
      
      const hourly = response.hourly()!;
      
      const wData = {
      
        hourly: {
          time: range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map(
            (t) => new Date((t + utcOffsetSeconds) * 1000)
          ),
          temperature2m: hourly.variables(0)!.valuesArray()!,
          rain: hourly.variables(1)!.valuesArray()!,
        },
      
      };
      
      for (let i = 0; i < wData.hourly.time.length; i++) {
        console.log(
          wData.hourly.time[i].toISOString(),
          wData.hourly.temperature2m[i],
          wData.hourly.rain[i]
        );
      }
      setWeatherData(wData);
      
    } catch (error) {
      console.error('Error fetching coordinates:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {

      const params = {
        "latitude": 40.7143,
        "longitude": -74.006,
        "hourly": ["temperature_2m", "rain"]
      };
      const url = "https://api.open-meteo.com/v1/forecast";
      const responses = await fetchWeatherApi(url, params);
      
      const range = (start: number, stop: number, step: number) =>
        Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);
      
      const response = responses[0];
      
      // Attributes for timezone and location
      const utcOffsetSeconds = response.utcOffsetSeconds();
      const timezone = response.timezone();
      const timezoneAbbreviation = response.timezoneAbbreviation();
      const latitude = response.latitude();
      const longitude = response.longitude();
      
      const hourly = response.hourly()!;
      
      const wData = {
      
        hourly: {
          time: range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map(
            (t) => new Date((t + utcOffsetSeconds) * 1000)
          ),
          temperature2m: hourly.variables(0)!.valuesArray()!,
          rain: hourly.variables(1)!.valuesArray()!,
        },
      
      };
      
      for (let i = 0; i < wData.hourly.time.length; i++) {
        console.log(
          wData.hourly.time[i].toISOString(),
          wData.hourly.temperature2m[i],
          wData.hourly.rain[i]
        );
      }


      setWeatherData(wData);
      // console.log(wData);
      
    };

    fetchData();
  }, [coordinates]);

  return (
    <div className="flex flex-col items-center p-24">
      Team Forecast

      <div className='flex flex-row justify-between space-x-4 py-2'>
        <Input placeholder="Latitude" value={myLatitude} onChange={(e) => setLatitude(parseFloat(e.target.value))}/>
        <Input placeholder="Longtitude" value={myLongitude} onChange={(e) => setLongitude(parseFloat(e.target.value))}/>
        <Button onClick={handleSearch}>Search</Button>
      </div>

      Hourly Temperature and Rain Data
      {weatherData && <WeatherChart weatherData={weatherData} />}

    </div>
  )
}
