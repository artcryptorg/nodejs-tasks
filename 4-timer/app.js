const readline = require('readline');
const rl = readline.createInterface(
    {
        input: process.stdin,
        output: process.stdout
    }
);


function askQuestion(query) {
    return new Promise((resolve) => {
        rl.question(query, (answer) => {
            console.log(`таймер установлен на ${answer}`)
            rl.close()
            resolve(answer)
        })
    })
}

function timeStringToMilliseconds(inputString) {
    const timeUnits = {
        "час": 3600000, "часа": 3600000, "часов": 3600000,
        "минут": 60000, "минута": 60000, "минуты": 60000,
        "секунд": 1000, "секунда": 1000, "секунды": 1000
    };

    let totalMilliseconds = 0;
    const regex = /(\d+)\s*(час[аов]?|минут[аы]?|секунд[аы]?)/g;

    let match;
    while ((match = regex.exec(inputString)) !== null) {
        const value = parseInt(match[1], 10);
        const unit = match[2];
        totalMilliseconds += value * timeUnits[unit];
    }

    return totalMilliseconds;
}


async function timer() {
    const answer = await askQuestion(`Установите таймер (например: "1 час 34 минуты 45 секунд"): `);
    console.log(`таймер установлен на ${answer}`);
    const time = timeStringToMilliseconds(answer);
    setTimeout(() => {
        console.log('BOOM');
    }, time);
}
timer()
