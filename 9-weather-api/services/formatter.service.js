

const formatWeather = (weather, icon) => {
    return `
  WEATHER: Погода в городе ${weather.name}
  ${icon} ${weather.weather[0].description}
  🌡️ Температура: ${weather.main.temp}°C (ощущается как ${weather.main.feels_like}°C)
  🌤️ Состояние: ${weather.weather[0].description}
  💧 Влажность: ${weather.main.humidity}%
  💨 Скорость ветра: ${weather.wind.speed} м/с
  `;
};

export { formatWeather };