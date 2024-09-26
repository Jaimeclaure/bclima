let tempChart, airPollutionChart, rainChart;

function displayForecastCharts(forecastData, airPollutionData) {
  const timestamps = forecastData.list.map(item => new Date(item.dt * 1000).toLocaleString());
  const temperatures = forecastData.list.map(item => item.main.temp);
  const rainfall = forecastData.list.map(item => item.rain ? item.rain['3h'] || 0 : 0);

  updateTempChart(timestamps, temperatures);
  updateRainChart(timestamps, rainfall);
  updateAirPollutionChart(airPollutionData);
}

function updateTempChart(labels, data) {
  const ctx = document.getElementById('tempChart').getContext('2d');
  if (tempChart) {
    tempChart.destroy();
  }
  tempChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Temperatura (°C)',
        data: data,
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Pronóstico de Temperatura a 5 días'
        }
      }
    }
  });
}

function updateRainChart(labels, data) {
  const ctx = document.getElementById('rainChart').getContext('2d');
  if (rainChart) {
    rainChart.destroy();
  }
  rainChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Lluvia (mm)',
        data: data,
        backgroundColor: 'rgb(54, 162, 235)'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Pronóstico de Lluvia a 5 días'
        }
      }
    }
  });
}

function updateAirPollutionChart(data) {
  const ctx = document.getElementById('airPollutionChart').getContext('2d');
  const pollutants = ['co', 'no', 'no2', 'o3', 'so2', 'pm2_5', 'pm10'];
  const pollutantNames = ['CO', 'NO', 'NO2', 'O3', 'SO2', 'PM2.5', 'PM10'];
  const values = pollutants.map(p => data.list[0].components[p]);

  if (airPollutionChart) {
    airPollutionChart.destroy();
  }
  airPollutionChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: pollutantNames,
      datasets: [{
        label: 'Concentración (µg/m³)',
        data: values,
        backgroundColor: 'rgb(75, 192, 192)'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Calidad del Aire'
        }
      }
    }
  });
}
