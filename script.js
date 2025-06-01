// Pobierz wszystkie elementy html, które mają być wykorzystywane w JS i przypisz je do zmiennych (15 zmiennych)
const input = document.querySelector('input');
const button = document.querySelector('.search button');
const errorMsg = document.querySelector('p.error_message');
const cityName = document.querySelector('h2.city_name');
const weatherImg = document.querySelector('img.weather_img');
const temp = document.querySelector('span.temp');
const weatherDescription = document.querySelector('p.weather_description');
const feelsLike = document.querySelector('span.feels_like');
const humidity = document.querySelector('span.humidity');
const pressure = document.querySelector('span.pressure');
const windSpeed = document.querySelector('span.wind_speed');
const clouds = document.querySelector('span.clouds');
const visibility = document.querySelector('span.visibility');
const pollutionImg = document.querySelector('img.pollution_img');
const pollutionValue = document.querySelector('span.value');

const apiInfo = {
    link : 'https://api.openweathermap.org/data/2.5/weather?q=',
    airPollutionLink: 'https://api.openweathermap.org/data/2.5/air_pollution?lat=',
    key : '&appid=e3d33a524e4953ba7aae6cd080419b23',
    units : '&units=metric',
    lang : '&lang=pl',
}

const getWeather = () => {
    const apiInfoCity = input.value.trim();
    if (!apiInfoCity) {
        errorMsg.textContent = 'Proszę podać nazwę miasta.';
        return;
    }

    const apiURL = `${apiInfo.link}${apiInfoCity}${apiInfo.key}${apiInfo.units}${apiInfo.lang}`;
    console.log(apiURL);

    axios.get(apiURL).then((response) => {
        console.log(response.data);
        cityName.textContent = `${response.data.name}, ${response.data.sys.country}`;
        
        // Pokaż obrazek pogodowy tylko, jeśli jest dostępny
        if (response.data.weather[0].icon) {
            weatherImg.src = `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`;
            weatherImg.style.display = 'block';
        } else {
            weatherImg.style.display = 'none';
            weatherImg.src = '';
        }

        temp.textContent = `${Math.round(response.data.main.temp)}°C`;
        weatherDescription.textContent = response.data.weather[0].description;
        feelsLike.textContent = `${Math.round(response.data.main.feels_like)}°C`;
        humidity.textContent = `${response.data.main.humidity}%`;
        pressure.textContent = `${response.data.main.pressure} hPa`;
        windSpeed.textContent = `${Math.round(response.data.wind.speed)} m/s`;
        clouds.textContent = `${response.data.clouds.all}%`;
        visibility.textContent = `${response.data.visibility / 1000} km`;
        errorMsg.textContent = '';

        const lat = response.data.coord.lat;
        const lon = response.data.coord.lon;

        const pollutionURL = `${apiInfo.airPollutionLink}${lat}&lon=${lon}${apiInfo.key}`;
        console.log(pollutionURL);

        axios.get(pollutionURL).then((pollutionResponse) => {
            console.log(pollutionResponse.data);
            const pm25 = pollutionResponse.data.list[0].components.pm2_5;
            pollutionValue.textContent = `${Math.round(pm25)}`;
            
            if (pm25 < 10) {
                pollutionImg.style.backgroundColor = "green"; 
            } else if (pm25 >= 10 && pm25 < 25) {
                pollutionImg.style.backgroundColor = "yellowgreen";  
            } else if (pm25 >= 25 && pm25 < 50) {
                pollutionImg.style.backgroundColor = "yellow";  
            } else if (pm25 >= 50 && pm25 < 75) {
                pollutionImg.style.backgroundColor = "orange"; 
            } else if (pm25 >= 75) {
                pollutionImg.style.backgroundColor = "red";  
            }
        });
    }).catch(error => {
        errorMsg.textContent = error.response?.data?.message || 'Wystąpił błąd podczas pobierania danych.';
        [cityName, temp, weatherDescription, feelsLike, pressure, humidity, clouds, visibility, pollutionValue, windSpeed].forEach(el => {
            el.textContent = '';
        });
        weatherImg.style.display = 'none';
        weatherImg.src = '';
        pollutionImg.style.backgroundColor = 'transparent';
    }).finally(() => {
        input.value = '';
    });
}

button.addEventListener('click', getWeather);

input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        getWeather();
    }
});

const themeBtn = document.getElementById('toggle-theme-btn');

themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
});
