module.exports = (emitter) => {
    emitter.on('substraction', (a, b) => {
        const result = a - b;
        emitter.emit('result', `Результат substraction: ${result}`);
    });
};