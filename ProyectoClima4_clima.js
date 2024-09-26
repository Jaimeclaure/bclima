const apiKey = '846c4d76b06fcd9dabd91ff406d30160';
const ciudades = [
  { nombre: 'Tarija', lat: -21.5355, lon: -64.7296 },
  { nombre: 'Santa Cruz de la Sierra', lat: -17.7863, lon: -63.1812 },
  { nombre: 'Sucre', lat: -19.0411, lon: -65.2548 },
  { nombre: 'Cochabamba', lat: -17.3895, lon: -66.1568 },
  { nombre: 'La Paz', lat: -16.5000, lon: -68.1500 },
  { nombre: 'Oruro', lat: -17.9833, lon: -67.1500 },
  { nombre: 'Potosi', lat: -19.5836, lon: -65.7531 },
  { nombre: 'Trinidad', lat: -14.8333, lon: -64.9000 },
  { nombre: 'Cobija', lat: -11.0225, lon: -68.7442 }
];

const citySelect = document.getElementById('citySelect');
const weatherContainer = document.getElementById('weatherContainer');

// Poblar las ciudades en el select
ciudades.forEach(ciudad => {
  const option = document.createElement('option');
  option.value = ciudad.nombre;
  option.text = ciudad.nombre;
  citySelect.appendChild(option);
});

// Función para obtener el clima actual, pronóstico y calidad del aire
function getWeatherAndForecast(city) {
  const selectedCity = ciudades.find(c => c.nombre === city);
  if (!selectedCity) {
    console.error('Ciudad no encontrada');
    return;
  }

  const { lat, lon } = selectedCity;
  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=es`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=es`;
  const airPollutionUrl = `https://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

  Promise.all([
    fetch(currentWeatherUrl).then(res => res.json()),
    fetch(forecastUrl).then(res => res.json()),
    fetch(airPollutionUrl).then(res => res.json())
  ]).then(([currentData, forecastData, airPollutionData]) => {
    displayCurrentWeather(currentData, city);
    displayAirQuality(airPollutionData.list[0], city);
    displayForecastCharts(forecastData, airPollutionData);
  }).catch(error => {
    console.error('Error fetching data:', error);
    weatherContainer.innerHTML = `<p>Error al obtener los datos: ${error.message}</p>`;
  });
}

// Mostrar el clima actual
function displayCurrentWeather(data, city) {
  weatherContainer.innerHTML = `
    <h2>Clima actual en ${city}, Bolivia:</h2>
    <p>Temperatura: ${data.main.temp}°C</p>
    <p>Sensación térmica: ${data.main.feels_like}°C</p>
    <p>Humedad: ${data.main.humidity}%</p>
    <p>Condiciones: ${data.weather[0].description}</p>
  `;
}

// Mostrar la calidad del aire
function displayAirQuality(data, city) {
  const airQuality = data.main.aqi;
  const components = data.components;

  const convertToMg = value => (value / 1000).toFixed(5);

  let interpretation;
  switch (airQuality) {
    case 1: interpretation = 'Buena. El aire es saludable para todos.'; break;
    case 2: interpretation = 'Moderada. La calidad del aire es aceptable.'; break;
    case 3: interpretation = 'Moderada para grupos sensibles.'; break;
    case 4: interpretation = 'Mala. Puede afectar la salud de grupos vulnerables.'; break;
    case 5: interpretation = 'Muy mala. Afecta a todos los grupos.'; break;
    default: interpretation = 'Datos no disponibles.';
  }

  const airQualityContainer = document.createElement('div');
  airQualityContainer.innerHTML = `
    <h3>Calidad del aire en ${city}</h3>
    <p><strong>Índice de calidad del aire (AQI):</strong> ${airQuality}</p>
    <p><strong>Interpretación:</strong> ${interpretation}</p>
    <p><strong>Composición del aire (mg/m³):</strong></p>
    <ul>
      <li>CO (Monóxido de Carbono): ${convertToMg(components.co)}</li>
      <li>NO (Monóxido de Nitrógeno): ${convertToMg(components.no)}</li>
      <li>NO2 (Dióxido de Nitrógeno): ${convertToMg(components.no2)}</li>
      <li>O3 (Ozono): ${convertToMg(components.o3)}</li>
      <li>SO2 (Dióxido de Azufre): ${convertToMg(components.so2)}</li>
      <li>PM2.5 (Partículas Finas): ${convertToMg(components.pm2_5)}</li>
      <li>PM10 (Partículas Inhalables): ${convertToMg(components.pm10)}</li>
      <li>NH3 (Amoniaco): ${convertToMg(components.nh3)}</li>
    </ul>
  `;
  weatherContainer.appendChild(airQualityContainer);
}

// Manejar el evento de selección de ciudad
citySelect.addEventListener('change', () => {
  const selectedCity = citySelect.value;
  if (selectedCity) {
    getWeatherAndForecast(selectedCity);
  } else {
    weatherContainer.innerHTML = '';
  }
});
