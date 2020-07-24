
const net = require('net');

let client = net.createConnection({port: 6000}, () => {
	process.stdin.on('data', chunk => {
		chunk = chunk.toString().trim();
		if (chunk === '/quit') {
			client.emit('end');
		}
		else {
			client.write(chunk);
		}
	});
})
.on('data', chunk => console.log(chunk.toString()))
.on('end', () => {
process.stdin.emit('end');
    
	
})