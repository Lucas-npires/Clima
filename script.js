//Pegar a cidade digitada pelo usuário e exibir a temperatura, umidade e descrição do tempo
const weatherForm = document.querySelector('.weatherForm');
const cityInput = document.querySelector('.cityInput');
const card = document.querySelector('.card');
const apiKey = "c26570a8cca57f38df11fcb32785ede9";

//Adicionando evento de submit ao formulário
weatherForm.addEventListener('submit', async event => {
    event.preventDefault();
    const city = cityInput.value;
    console.log(city)
    if (city) {
        try {
            const weatherData = await getWeather(city);
            displayWeather(weatherData);
        } catch (error) {
            displayError(error);
        }
    } else {
        displayError("Por favor, digite a cidade");
    }
});

//Função para buscar dados da API com base na cidade digitada
async function getWeather(city) {
    const apiUrl = `https://api.openweathermap.org
/data/2.5/weather?q=${city}&appid=${apiKey}`

    const response = await fetch(apiUrl);

    if(!response.ok) {
        throw new Error('Não foi possível buscar dados');
    }

    return await response.json();

}

//Função para exibir os dados na tela e formata-los caso necessário
function displayWeather(data) {
    console.log(data);
    const {
            name: city, 
            main: {temp, humidity},
            weather: [{description, id}]} = data;

            card.textContent = "";
            card.style.display = 'flex';

            const cityDisplay = document.createElement('h1');
            const tempDisplay = document.createElement('p');
            const humidityDisplay = document.createElement('p');
            const descDisplay = document.createElement('p');
            // const weatherDisplay = document.createElement('p');
            // a const acima somente exibe o código do tempo, não sendo necessário para o usuário
            const weatherEmoji = document.createElement('p');

            const tempCelsius = temp - 273.15; //conversão de kelvin para celsius

            cityDisplay.textContent = city;
            tempDisplay.textContent = `${tempCelsius.toFixed(1)}°C`; //toFixed(1) para arredondar para 1 casa decimal
            humidityDisplay.textContent = `Umidade: ${humidity}%`;
            const translatedDescription = translations[description] || description;
            descDisplay.textContent = translatedDescription;
            // weatherDisplay.textContent = `Código do tempo: ${id}`;
            weatherEmoji.textContent = getWeatherEmoji(id);

            tempDisplay.classList.add('tempDisplay');
            humidityDisplay.classList.add('humidityDisplay');
            descDisplay.classList.add('descDisplay');
            // weatherDisplay.classList.add('weatherDisplay');

            cityDisplay.classList.add('cityDisplay');
            weatherEmoji.classList.add('tempEmoji');
            

            card.appendChild(cityDisplay);
            card.appendChild(tempDisplay);
            card.appendChild(humidityDisplay);
            card.appendChild(descDisplay);
            // card.appendChild(weatherDisplay);
            card.appendChild(weatherEmoji);

}

function getWeatherEmoji(weatherId) {

    switch(true) {
        case (weatherId >= 200 && weatherId < 300):
            return '⛈️';
        case (weatherId >= 300 && weatherId < 400):
            return '🌧️';
        case (weatherId >= 500 && weatherId < 600):
            return '🌧️';
        case (weatherId >= 600 && weatherId < 700):
            return '❄️';
        case (weatherId >= 700 && weatherId < 800):
            return '🌫️';
        case (weatherId === 800):
            return '☀️';
        case (weatherId > 800):
            return '☁️';
        default:
            return '❓';
    }
}

function displayError(message) {
    const errorDisplay = document.createElement('p');
    errorDisplay.textContent = message;
    errorDisplay.classList.add('errorDisplay');

    card.textContent = '';
    card.style.display = 'flex';
    card.appendChild(errorDisplay);
}

// Tabela de tradução inglês -> português
// Poderia ser usada a biblioteca i18n-js para tradução de textos, mas por ser pouca coisa a ser traduzida, optei por fazer manualmente
const translations = {
    "clear sky": "céu limpo",
    "few clouds": "poucas nuvens",
    "scattered clouds": "nuvens dispersas",
    "broken clouds": "nuvens quebradas",
    "shower rain": "chuva de intensidade moderada",
    "rain": "chuva",
    "thunderstorm": "tempestade",
    "snow": "neve",
    "mist": "névoa"
};