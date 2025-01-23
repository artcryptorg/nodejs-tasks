module.exports = (emitter) => {
    emitter.on('division', (a, b) => {
        if (b === 0) {
            emitter.emit('result', "Ошибка: деление на ноль невозможно");
        } else {
            const result = a / b;
            emitter.emit('result', `Результат division: ${result}`);
        }
    });
};