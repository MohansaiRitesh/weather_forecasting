const apiKey = "bf1388d3838795d2b8d13a7d6d202db5";

async function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) return;

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  await fetchWeather(url);
}

async function getWeatherByLocation() {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser.");
    return;
  }

  navigator.geolocation.getCurrentPosition(async (position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    await fetchWeather(url);
  }, () => {
    alert("Unable to retrieve your location.");
  });
}

async function fetchWeather(url) {
  const loader = document.getElementById("loader");
  const result = document.getElementById("weatherResult");
  loader.style.display = "block";
  result.innerHTML = "";

  try {
    const response = await fetch(url);
    loader.style.display = "none";

    if (!response.ok) throw new Error("City not found");

    const data = await response.json();

    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    const now = new Date();
    const dateString = now.toLocaleString();

    result.innerHTML = `
      <p><strong>${dateString}</strong></p>
      <h2>${data.name}, ${data.sys.country}</h2>
      <img src="${iconUrl}" alt="Weather Icon">
      <p>Temperature: ${data.main.temp}°C</p>
      <p>Humidity: ${data.main.humidity}%</p>
      <p>Weather: ${data.weather[0].description}</p>
    `;
  } catch (error) {
    loader.style.display = "none";
    result.innerHTML = `<p style="color:red;">${error.message}</p>`;
  }
}