
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

    const operands = {
        add: './add.js',
        multiply: './multiply.js',
        substraction: './substraction.js',
        division: './division.js',
    }

    const operand = args[0];
    const path = operands[operand]
    if (!path) {
        throw new Error("такой операции нет");
    }

    const operationModule = require(path)
    console.log(operationModule(firstElement, secondElement))
}
catch (error) {
    console.error("Ошибка:", error.message);
    process.exit(1);
}
