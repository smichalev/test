const app = require('express')();
const axios = require('axios');

const server = require('http').Server(app);
const io = require('socket.io')(server);

server.listen(process.env.PORT, process.env.HOST, () => {
	console.log('Сервер запущен! Перейдите на http://' + process.env.FORWARD_HOST + ':' + process.env.PORT);
});

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

let getContent = async () => {
	try {
		let {data: {result}} = await axios.get(`http://${process.env.API_HOST}:${process.env.API_PORT}`);
		
		console.log(result);
		
		let total = {
			sum: [],
			max: [],
			min: [],
			avg: [],
		};
		
		for (let i = 0; i < result.length; i++) {
			let a = 0;
			let b = [];
			let c = 0;
			
			for (let k = 1; k <= 20; k++) {
				a += +result[i]['param' + k];
				b.push(+result[i]['param' + k]);
				c += Math.abs(+result[i]['param' + k]);
			}
			
			total.sum.push(a.toFixed(4));
			total.max.push(Math.max(...b).toFixed(4));
			total.min.push(Math.min(...b).toFixed(4));
			total.avg.push((c / 20).toFixed(4));
		}
		
		result.sort((a, b) => +a.entity.substr(6) - +b.entity.substr(6));
		
		return {result, total};
	}
	catch (e) {
		console.error(e);
		
		return {
			result: [],
			total: {
				sum: [],
				max: [],
				min: [],
				avg: [],
			},
		};
	}
};

setInterval(async () => {
	io.emit('notify', {data: await getContent()});
}, 1000);
