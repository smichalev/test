const NATS = require('nats');

const nats = NATS.connect({
	"servers": [
		process.env.NATS_SERVER,
	],
});

let random = (length = 10) => {
	let pass = "";
	let dic = "abcdefghijklmnopqrstuvwxyz1234567890";
	
	for (let i = 0; i < length; i++) {
		pass += dic.charAt(Math.floor(Math.random() * dic.length));
	}
	
	return pass;
};

let shuffle = (array) => {
	array.sort(() => Math.random() - 0.5);
};

let generate = () => {
	let newValues = [];
	
	for (let i = 1; i <= 20; i++) {
		let element = {
			id: random(),
			entity: 'Entity' + i,
		};
		
		for (let n = 1; n <= 20; n++) {
			element['param' + n] = +(Math.random() * 2 - 1).toFixed(4);
		}
		
		newValues.push(element);
	}
	
	shuffle(newValues);
	
	return newValues;
};

let push = () => {
	nats.publish('from_generator', JSON.stringify(generate()));
};

setInterval(push, 100);

