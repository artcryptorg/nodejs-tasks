module.exports = (a, b) => {
	if (b === 0) {
		throw new Error("Деление на ноль невозможно");
	}
	return Math.floor(a / b);
};

