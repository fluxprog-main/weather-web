import axios from "axios";
import React, { useState, useEffect } from "react";
import "./App.css";
import Loader from "./Loader";

import cloud from "./assets/cloud.png";
import notFound from "./assets/404.png";

function App() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [city, setCity] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    startingWeather();
  }, []);

  async function startingWeather() {
    try {
      setLoading(true);
      const londonWeather = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=London&appid=${
          import.meta.env.VITE_OPENWEATHER_API_KEY
        }&units=metric&lang=uz`
      );
      setWeather(londonWeather.data);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError("City not found");
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  }

  async function fetchWeather(e) {
    e.preventDefault();
    setWeather(null);
    setError("");

    if (!city) return;

    try {
      setLoading(true);
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${
          import.meta.env.VITE_OPENWEATHER_API_KEY
        }&units=metric&lang=uz`
      );
      setWeather(res.data);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError("City not found");
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mt-5 w-100">
      <div className="form-wrapper d-flex justify-content-center">
        <form className="d-flex form mb-4" onSubmit={fetchWeather}>
          <input
            type="text"
            className="form-control w-100 me-2"
            placeholder="Shahar nomini kiriting"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button className="btn btn-primary" type="submit">
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
        </form>
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <div className="text-white d-flex justify-content-center card-wrapper">
          <div className="text-center weather-card">
            <img src={notFound} className="error-img" alt="Weather icon" />
            <h1 className="error-info">{error}</h1>
          </div>
        </div>
      ) : weather ? (
        <div className="text-white d-flex justify-content-center card-wrapper">
          <div className="text-center weather-card">
            <img src={cloud} className="weather-img" alt="Weather icon" />
            <h1 className="weather-ctiy" style={{ fontSize: "50px" }}>
              {weather.name}
            </h1>
            <h1 className="weather-temp">{weather.main.temp}°C</h1>
            <p className="weather-desc">{weather.weather[0].description}</p>
            <div className="weather-box d-flex justify-content-between">
              <div className="weather-humidity d-flex gap-2 align-items-center">
                <i className="fa-solid fa-droplet icon"></i>
                <div className="text-start">
                  <h5>{weather.main.humidity}%</h5>
                  <p>Humidity</p>
                </div>
              </div>
              <div className="weather-windspeed d-flex gap-2 align-items-center">
                <i className="fa-solid fa-wind icon"></i>
                <div className="text-start">
                  <h5>{weather.wind.speed} Km/h</h5>
                  <p>WindSpeed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default App;
