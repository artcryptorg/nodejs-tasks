const EventEmmiter = require('events');
const registerAdd = require('./add.js');
const registerMultiply = require('./multiply.js');
const registerSubstraction = require('./substraction.js');
const registerDivision = require('./division.js');

try {
    const args = process.argv.slice(2);

    if (args.length < 3) {
        throw new Error("нехватает элементов");
    }
    if (args.length > 3) {
        throw new Error("много элементов");
    }

    const firstElement = Number(args[1]);
    const secondElement = Number(args[2]);
    if (isNaN(firstElement) || isNaN(secondElement)) {
        throw new Error("Операнды должны быть числами");
    }

    const operand = args[0];
    const operands = ['add', 'multiply', 'substraction', 'division']
    if (!operands.includes(operand)) {
        throw new Error("такой операции нет");
    }

    const myEmmiter = new EventEmmiter()
    registerAdd(myEmmiter);
    registerMultiply(myEmmiter);
    registerSubstraction(myEmmiter);
    registerDivision(myEmmiter);

    myEmmiter.on('result', (data) => (console.log(data)))
    myEmmiter.emit(operand, firstElement, secondElement)

}
catch (error) {
    console.error("Ошибка:", error.message);
    process.exit(1);
}
