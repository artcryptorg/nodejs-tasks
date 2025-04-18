import { homedir } from 'os';
import { join } from 'path';
import { promises } from 'fs';

const filePath = join(homedir(), 'weather-data.json');
interface ITOKEN_DICTIONARY {
	token: string,
	language: string,
	city?: string[]
};

const TOKEN_DICTIONARY: ITOKEN_DICTIONARY = {
	token: 'token',
	language: 'ru',
	city: []
}

const saveKeyValue = async (key: keyof ITOKEN_DICTIONARY, value: string): Promise<void> => {
	let data: Record<string, any> = {};
	data['language'] = TOKEN_DICTIONARY.language;
	if (await isExist(filePath)) {
		const file = await promises.readFile(filePath, "utf-8");
		data = JSON.parse(file);
	}

	if (Array.isArray(TOKEN_DICTIONARY[key])) {
		if (!Array.isArray(data[key])) {
			data[key] = [];
		}
		(data[key] as string[]).push(value as string);
	} else {
		data[key] = value;
	}
	await promises.writeFile(filePath, JSON.stringify(data));
};

const clearData = async (key: keyof ITOKEN_DICTIONARY) => {

	if (await isExist(filePath)) {
		const file = await promises.readFile(filePath, "utf-8");
		const data = JSON.parse(file);
		if (data[key]) {
			delete data[key];
			await promises.writeFile(filePath, JSON.stringify(data));
		}
	}
}

const getKeyValue = async <T extends keyof ITOKEN_DICTIONARY>(key: T): Promise<ITOKEN_DICTIONARY[T] | undefined> => {
	if (await isExist(filePath)) {
		const file = await promises.readFile(filePath, "utf-8");
		const data: ITOKEN_DICTIONARY = JSON.parse(file);
		return data[key];
	}
	return undefined;
}

const isExist = async (path: string): Promise<boolean> => {
	try {
		await promises.stat(path);
		return true;
	} catch (e) {
		return false
	}
}
const languageCodes: Set<string> = new Set([
	"sq", "af", "ar", "az", "eu", "be", "bg", "ca", "zh_cn", "zh_tw",
	"hr", "cz", "da", "nl", "en", "fi", "fr", "gl", "de", "el", "he",
	"hi", "hu", "is", "id", "it", "ja", "kr", "ku", "la", "lt", "mk",
	"no", "fa", "pl", "pt", "pt_br", "ro", "ru", "sr", "sk", "sl",
	"sp", "es", "sv", "se", "th", "tr", "ua", "uk", "vi", "zu"
]);
const languageIsExist = (language: string): boolean => {
	return languageCodes.has(language);
};

export { saveKeyValue, getKeyValue, clearData, TOKEN_DICTIONARY, languageIsExist, ITOKEN_DICTIONARY, languageCodes };