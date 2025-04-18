import express from 'express';
import { getForcast } from './weather.js';
import { saveKeyValue, clearData, TOKEN_DICTIONARY, languageIsExist, getKeyValue, ITOKEN_DICTIONARY } from './services/storage.service.js';
import { ConfigRequest } from './types/requests.js';

const port = 8000;
const app = express();
app.use(express.json());

app.get('/weather', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const weatherText = await getForcast();
        res.set('Content-Type', 'text/plain');
        res.send(weatherText);
    } catch (e) {
        next(e);
    }
});

app.post('/config', async (req: express.Request<{}, {}, ConfigRequest>, res: express.Response, next: express.NextFunction) => {

    const { token, city, language } = req.body;
    try {
        if (token) {
            await saveKeyValue("token", token);
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
        const token = await getKeyValue("token");
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

app.use((err: unknown, req: express.Request, res: express.Response, next: express.NextFunction) => {
    const errorMessage = err instanceof Error ? err.message : "Неизвестная ошибка";
    console.error(`❌ Произошла ошибка: ${errorMessage}`);
    res.set("Content-Type", "text/plain");
    res.status(500).send(`❌ Ошибка сервера: ${errorMessage}`);
});


app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});

