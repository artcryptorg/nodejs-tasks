import axios from 'axios'
import { getKeyValue, TOKEN_DICTIONARY, ITOKEN_DICTIONARY } from './storage.service.js';
import { IWeatherData } from '../types/weather.js';




const getIcon = (icon: string) => {
	switch (icon.slice(0, -1)) {
		case '01':
			return '☀️';
		case '02':
			return '🌤️';
		case '03':
			return '☁️';
		case '04':
			return '☁️';
		case '09':
			return '🌧️';
		case '10':
			return '🌦️';
		case '11':
			return '🌩️';
		case '13':
			return '❄️';
		case '50':
			return '🌫️';
		default: return '❓';
	}
};

const getWeather = async (city: string, lang: string): Promise<IWeatherData> => {
	const token = process.env.TOKEN ?? await getKeyValue("token");
	if (!token) {
		throw new Error('Не задан ключ API, задайте его')
	};
	const { data } = await axios.get<IWeatherData>('https://api.openweathermap.org/data/2.5/weather', {
		params: {
			q: city,
			appid: token,
			lang: lang,
			units: 'metric'
		}
	});
	return data;
}

export { getWeather, getIcon };