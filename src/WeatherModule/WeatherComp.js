import React, { useState } from "react";
import "./weatherComp.css";

const WeatherComp = () => {
  const [forecastData, setForecastData] = useState([]);
  const [cityName, setCityName] = useState('');
  const [isLoading,setIsLoading]=useState(false)
  const apiKey = "1635890035cbba097fd5c26c8ea672a1 ";
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`;

  const handleChange = (e) => {
    setCityName(e.target.value);
  };

  const handleSubmitData = async (e) => {
    e.preventDefault();
    try {
        setIsLoading(true)
      const response = await fetch(url);
      const data = await response.json();
      setForecastData(data.list);
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching forecast:', error);
    }
  };

  const groupForecastByDay = () => {
    const groupedData = {};
    if (!forecastData) return groupedData;
    forecastData.forEach(item => {
      const date = new Date(item.dt * 1000).toLocaleDateString();
      if (!groupedData[date]) {
        groupedData[date] = item;
      } else {
        if (item.main.temp_max > groupedData[date].main.temp_max) {
          groupedData[date].main.temp_max = item.main.temp_max;
        }
        if (item.main.temp_min < groupedData[date].main.temp_min) {
          groupedData[date].main.temp_min = item.main.temp_min;
        }
        if (!groupedData[date].main.pressure) {
          groupedData[date].main.pressure = item.main.pressure;
        }
        if (!groupedData[date].main.humidity) {
          groupedData[date].main.humidity = item.main.humidity;
        }
      }
    });
    return groupedData;
  };

  return (
    <div className="container">
      <div className="header">
        <div className="heading">
          <h2>Weather In Your City</h2>
        </div>
        <div className="formFields">
          <form onSubmit={handleSubmitData}>
            <input
              type="text"
              name="cityName"
              id="cityName"
              placeholder="Enter City Name"
              onChange={handleChange}
            />
            <button type="submit">Search</button>
            {isLoading?<span>IsLoading</span>:""}
          </form>
        </div>
      </div>
      <div className="resultSection">
        {Object.entries(groupForecastByDay()).map(([date, forecast]) => (
          <table key={date}>
            <thead>
              <tr>
                <th colSpan="2">Date: {date}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th colSpan="2">Temperature</th>
              </tr>
              <tr>
                <th>Min</th>
                <th>Max</th>
              </tr>
              <tr>
                <td>{forecast.main.temp_min}</td>
                <td>{forecast.main.temp_max}</td>
              </tr>
              <tr>
                <td>Pressure</td>
                <td>{forecast.main.pressure}</td>
              </tr>
              <tr>
                <td>Humidity</td>
                <td>{forecast.main.humidity}</td>
              </tr>
            </tbody>
          </table>
        ))}
      </div>
    </div>
  );
};

export default WeatherComp;
