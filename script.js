const API_KEY = "63ac5117eb7e2cb9d485fafa80a44a88";

const WEATHER_API_ENDPOINT =
  `https://api.openweathermap.org/data/2.5/weather?appid=${API_KEY}&units=metric&q=`;

const FORECAST_API_ENDPOINT =
  `https://api.openweathermap.org/data/2.5/forecast?appid=${API_KEY}&units=metric&q=`;

// DOM Elements
const userLocation = document.getElementById("userLocation"),
  converter = document.getElementById("converter"),
  Forecast = document.querySelector(".Forecast"),
  weatherIcon = document.querySelector(".weatherIcon"),
  date = document.querySelector(".date"),
  temperature = document.querySelector(".temperature"),
  feelsLike = document.querySelector(".feelsLike"),
  description = document.querySelector(".description"),
  city = document.querySelector(".city"),
  HValue = document.getElementById("HValue"),
  WValue = document.getElementById("WValue"),
  PValue = document.getElementById("PValue");

// MAIN FUNCTION
async function findUserLocation() {
  if (!userLocation.value) {
    alert("Please enter a city name");
    return;
  }

  Forecast.innerHTML = "";

  try {
    // CURRENT WEATHER
    const res = await fetch(WEATHER_API_ENDPOINT + userLocation.value);
    const data = await res.json();

    if (data.cod !== 200) {
      alert(data.message);
      return;
    }

    city.innerHTML = `${data.name}, ${data.sys.country}`;

    weatherIcon.style.backgroundImage =
      `url(https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png)`;

    temperature.innerHTML = TemperatureConverter(data.main.temp);

    date.innerHTML = new Date().toLocaleString();

    feelsLike.innerHTML =
      "Feels like " + TemperatureConverter(data.main.feels_like);

    description.innerHTML = data.weather[0].description;

    HValue.innerHTML = data.main.humidity + "%";
    WValue.innerHTML = data.wind.speed + " m/s";
    PValue.innerHTML = data.main.pressure + " hPa";

    // FORECAST DATA
    const forecastRes = await fetch(
      FORECAST_API_ENDPOINT + userLocation.value
    );
    const forecastData = await forecastRes.json();

    Forecast.innerHTML = "";

    // Next 5 forecasts
    forecastData.list.slice(0, 5).forEach((item) => {
      const div = document.createElement("div");

      div.innerHTML = `
        <p>${new Date(item.dt_txt).toDateString()}</p>
        <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png"/>
        <p>${item.weather[0].description}</p>
        <p>${TemperatureConverter(item.main.temp)}</p>
      `;

      Forecast.appendChild(div);
    });

  } catch (error) {
    console.error("Error:", error);
    alert("Something went wrong!");
  }
}

// TEMPERATURE CONVERTER
function TemperatureConverter(temp) {
  let cTemp = Math.round(temp);

  if (converter.value === "°C") {
    return cTemp + " °C";
  } else {
    let fTemp = Math.round((cTemp * 9) / 5 + 32);
    return fTemp + " °F";
  }
}