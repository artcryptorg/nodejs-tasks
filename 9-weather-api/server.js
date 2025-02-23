import express from 'express';
import { getForcast } from './weather.js';
import { saveKeyValue, clearData, TOKEN_DICTIONARY, languageIsExist, getKeyValue } from './services/storage.service.js';

const port = 8000;
const app = express();
app.use(express.json());

app.get('/weather', async (req, res, next) => {
    try {
        const weatherText = await getForcast();
        res.set('Content-Type', 'text/plain');
        res.send(weatherText);
    } catch (e) {
        next(e);
    }
});

app.post('/config', async (req, res, next) => {
    const { token, city, language } = req.body;
    try {
        if (token) {
            await saveKeyValue(TOKEN_DICTIONARY.token, token);
        }
        if (city) {
            await saveKeyValue('city', city);
        }
        if (language) {
            if (!languageIsExist(language)) {
                throw new Error(`❌ Язык "${language}" не поддерживается.`);
            }
            await saveKeyValue('language', language);
        }
        res.send('✅ Параметры успешно обновлены.');
    } catch (e) {
        next(e);
    }
});

app.get('/config', async (req, res, next) => {
    try {
        const token = await getKeyValue(TOKEN_DICTIONARY.token);
        const cities = await getKeyValue('city') || [];
        const language = await getKeyValue('language') || 'Не установлен';

        res.json({
            token: token || 'Не установлен',
            cities: cities.length > 0 ? cities : 'Нет добавленных городов',
            language
        });
    } catch (e) {
        next(e);
    }
});

app.get('/config/clear', async (req, res, next) => {
    try {
        await clearData('city');
        res.send('✅ Массив городов успешно очищен.');
    } catch (e) {
        next(e);
    }
});

app.use((err, req, res, next) => {
    console.error(`❌ Произошла ошибка: ${err.message}`);
    res.set('Content-Type', 'text/plain');
    res.status(500).send(`❌ Ошибка сервера: ${err.message}`);
});

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});

