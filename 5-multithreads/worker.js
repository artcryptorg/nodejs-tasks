const { parentPort, workerData } = require('worker_threads')

function counter(array) {
	let count = 0;
	array.forEach(element => {
		if (element % 3 == 0) {
			count++
		}
	});
	return count;
}

parentPort.postMessage(counter(workerData))