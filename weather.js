function refreshWeather(response) {

  let temperature = response.data.temperature.current;
  let description = response.data.condition.description;
  let humidity = response.data.temperature.humidity;
  let windSpeed = response.data.wind.speed;
  let iconUrl = response.data.condition.icon_url;

  document.querySelector("#city").innerHTML = response.data.city;
  document.querySelector("#description").innerHTML = description;
  document.querySelector("#temperature").innerHTML = Math.round(temperature);
  document.querySelector("#humidity").innerHTML = `${humidity}%`;
  document.querySelector("#wind-speed").innerHTML = `${windSpeed} km/h`;
  document.querySelector("#time").innerHTML = formatDate(new Date(response.data.time * 1000));
  document.querySelector("#icon").innerHTML = `<img src="${iconUrl}" class="weather-app-icon" />`;

  updateBackground(description);

  getForecast(response.data.city);
}

function updateBackground(description) {
  let body = document.querySelector("body");
  body.className = ""; 

  let classMap = {
    "clear sky": "clear-sky",
    "few clouds": "few-clouds",
    "scattered clouds": "scattered-clouds",
    "broken clouds": "broken-clouds",
    "overcast clouds": "overcast-clouds",
    "overcast": "overcast-clouds", 
    "shower rain": "shower-rain",
    "rain": "rain",
    "light intensity drizzle rain": "light-rain",
    "moderate rain": "moderate-rain",  
    "light rain": "light-rain",       
    "thunderstorm": "thunderstorm",
    "snow": "snow",
    "mist": "mist",
  };

  if (classMap[description]) {
    body.classList.add(classMap[description]);
  } else {
    console.warn("Unmapped weather description:", description);
  }
}

function formatDate(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  let day = days[date.getDay()];

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${day} ${hours}:${minutes}`;
}

function searchCity(city) {
  let apiKey = "dfa1at2b904732fc58131co4458af1ff";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}`;
  axios.get(apiUrl).then(refreshWeather);
}

function handleSearchSubmit(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-form-input");
  searchCity(searchInput.value);
}

function getForecast(city) {
  let apiKey = "dfa1at2b904732fc58131co4458af1ff";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}`;
  axios.get(apiUrl).then(displayForecast);
}

function displayForecast(response) {
  let forecastHtml = "";
  response.data.daily.forEach(function (day, index) {
    if (index < 5) {
      forecastHtml += `
        <div class="weather-forecast-day">
          <div class="weather-forecast-date">${formatDay(day.time)}</div>
          <img src="${day.condition.icon_url}" class="weather-forecast-icon" />
          <div class="weather-forecast-temperatures">
            <strong>${Math.round(day.temperature.maximum)}°</strong> / 
            ${Math.round(day.temperature.minimum)}°
          </div>
        </div>
      `;
    }
  });

  document.querySelector("#forecast").innerHTML = forecastHtml;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[date.getDay()];
}

document.querySelector("#search-form").addEventListener("submit", handleSearchSubmit);

searchCity("Ilhabela");
