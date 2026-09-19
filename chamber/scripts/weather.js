
const apiKey = "aa04df0768a7e79d568e90f3aa754a26";


const lat = 20.5888;
const lon = -100.3899;

const currentWeatherEl = document.getElementById("current-weather");
const forecastEl = document.getElementById("forecast");

// ---------------- Api Wheater ----------------
async function getCurrentWeather() {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=es`;
  const response = await fetch(url);
  const data = await response.json();
  displayCurrentWeather(data);
}

const displayCurrentWeather = (data) => {
  const temp = Math.round(data.main.temp);
  const description = data.weather[0].description;
  const iconCode = data.weather[0].icon;

  currentWeatherEl.innerHTML = `
    <img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="${description}" width="70" height="70" />
    <p class="current-temp">${temp}&deg;C</p>
    <p class="current-desc">${description}</p>
  `;
};

getCurrentWeather();

// ---------------- 3 day forecast ----------------
async function getForecast() {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=es`;
  const response = await fetch(url);
  const data = await response.json();
  displayForecast(data.list);
}

const displayForecast = (list) => {

  const dailyMap = {};
  list.forEach((entry) => {
    const date = entry.dt_txt.split(" ")[0];
    if (!dailyMap[date]) {
      dailyMap[date] = [];
    }
    dailyMap[date].push(entry);
  });

  const todayStr = new Date().toISOString().split("T")[0];
  const upcomingDates = Object.keys(dailyMap)
    .filter((date) => date !== todayStr)
    .slice(0, 3);

  forecastEl.innerHTML = "";

  upcomingDates.forEach((date) => {
    const entries = dailyMap[date];
    
    const midday =
      entries.find((entry) => entry.dt_txt.includes("12:00:00")) ||
      entries[Math.floor(entries.length / 2)];

    const temp = Math.round(midday.main.temp);
    const dayLabel = new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
      weekday: "long",
    });

    const card = document.createElement("div");
    card.className = "forecast-day";
    card.innerHTML = `
      <p class="forecast-label">${dayLabel}</p>
      <p class="forecast-temp">${temp}&deg;C</p>
    `;
    forecastEl.appendChild(card);
  });
};

getForecast();
