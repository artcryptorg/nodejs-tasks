module.exports = (emitter) => {
    emitter.on('add', (a, b) => {
        const result = a + b;
        emitter.emit('result', `Результат add: ${result}`);
    });
};