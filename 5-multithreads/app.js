const os = require('os');
const { Worker } = require('worker_threads');
const { performance, PerformanceObserver } = require('perf_hooks');


const performanceObserver = new PerformanceObserver((items) => {
	items.getEntries().forEach((entry) => {
		console.log(`${entry.name}: ${entry.duration}`);
	});
});
performanceObserver.observe({ entryTypes: ['measure'] });

const arr = [];
for (let i = 0; i < 30000000; i++) {
	arr[i] = i + 1;
};

function counter(array) {
	performance.mark('line start')

	let count = 0;
	array.forEach(element => {
		if (element % 3 == 0) {
			count++
		}
	});
	performance.mark('line end');
	performance.measure('line', 'line start', 'line end')
	return count;
}
const divisibleByThree = counter(arr);
console.log(`Количество чисел, которые делятся на 3 без остатка: ${divisibleByThree}`);

const logicalCores = os.cpus().length;
console.log(`Количество логических ядер: ${logicalCores}`);

function splitArray(array, numParts) {
	const chunkSize = Math.ceil(array.length / numParts);
	const chunks = [];

	for (let i = 0; i < array.length; i += chunkSize) {
		chunks.push(array.slice(i, i + chunkSize));
	}
	return chunks;
}

const splitArrays = splitArray(arr, logicalCores);

const workers = splitArrays.map((chunk) => {
	return new Promise((resolve, reject) => {

		const worker = new Worker('./worker.js', {
			workerData: chunk
		});
		worker.on('message', (msg) => {
			resolve(msg);
		});
	});
})

const main = async () => {
	try {
		performance.mark('start');
		const result = await Promise.all(workers);
		const sum = result.reduce((a, b) => a + b, 0);
		console.log(`Количество чисел, которые делятся на 3 без остатка ПОТОКАМИ: ${sum}`);
		performance.mark('end');
		performance.measure('main', 'start', 'end');
	}
	catch (e) {
		console.error(e.message)
	}
}

main()