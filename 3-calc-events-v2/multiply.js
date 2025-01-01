module.exports = (emitter) => {
    emitter.on('multiply', (a, b) => {
        const result = a * b;
        emitter.emit('result', `Результат multiply: ${result}`);
    });
};