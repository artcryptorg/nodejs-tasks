import { getWeather, getIcon } from './services/api.service.js';
import { getKeyValue, } from './services/storage.service.js';
import { formatWeather } from './services/formatter.service.js';


const getForcast = async () => {
	try {
		const cities = process.env.CITY ? [process.env.CITY] : await getKeyValue('city');
		if (!cities || cities.length === 0) {
			return 'Список городов пуст. Добавьте хотя бы один город.';
		}
		const lang = await getKeyValue('language');
		let responseText = '';
		for (const city of cities) {
			try {
				const weather = await getWeather(city, lang);
				const icon = getIcon(weather.weather[0].icon);
				responseText += formatWeather(weather, icon);
			} catch (e) {
				responseText += `Ошибка для города ${city}: ${e.message}\n`;
			}
		}
		return responseText.trim();
	} catch (e) {
		return `Ошибка: ${e.message}`;
	}
};


export { getForcast }