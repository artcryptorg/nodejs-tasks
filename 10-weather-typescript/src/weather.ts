import { getWeather, getIcon } from './services/api.service.js';
import { getKeyValue, TOKEN_DICTIONARY, } from './services/storage.service.js';
import { formatWeather } from './services/formatter.service.js';


const getForcast = async (): Promise<string> => {
	try {
		const cities = process.env.CITY ? [process.env.CITY] : await getKeyValue('city');
		if (!cities || cities.length === 0) {
			return 'Список городов пуст. Добавьте хотя бы один город.';
		}
		const lang: string = await getKeyValue('language') || TOKEN_DICTIONARY.language || "ru";
		let responseText = '';
		for (const city of cities) {
			try {
				const weather = await getWeather(city, lang);
				const icon = getIcon(weather.weather[0].icon);
				responseText += formatWeather(weather, icon);
			} catch (e: unknown) {
				const errorMessage = e instanceof Error ? e.message : "Неизвестная ошибка";
				responseText += `Ошибка для города ${city}: ${errorMessage}\n`;
			}
		}
		return responseText.trim();
	} catch (e: unknown) {
		const errorMessage = e instanceof Error ? e.message : "Неизвестная ошибка";
		return `Ошибка: ${errorMessage}`;
	}
};


export { getForcast }