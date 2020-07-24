const server = net.createServer();
const output = fs.createWriteStream('server.log');
const net = require('net');
const fs = require('fs');
let users = [];
let count = 1;
let admin = '12345';


server.listen(6000, () => log('Server up on port: 6000'));

server.on('connection', socket => {

	socket.id = count++;
	socket.name = null;
	users.push(socket);
    socket.write('Welcome!!! type /quit to leave chat!');
	
	socket.on('data', chunk => {
		chunk = chunk.toString().trim();
		if( socket.name === null){
			//username
		} else if(chunk[0] === '/'){
			//handle input commands
		} else {
			log(`socket.name and chunk $$`)
			//notify
		}

	})
	.on('end', () => {
		for (let i in users) {
			if (users[i].id === socket.id) users.splice(i, 1);
		}
		log(`User ${socket.id} has disconnected`)
	})
})

function log(message) {
	console.log(message);
	output.write(message + '\n');
}





// const net = require('net');
// const fs = require('fs');
// let user = 0;
// let sockets = [];

// let output = fs.createWriteStream('server.log')
// let server = net.createServer(client => {

//     user++;

    
//     client.userName = "user" + user;
//     let userName = client.userName
//     sockets.push(client);

//     messages(userName, userName, + ' joined this chat.\n');

//     console.log(userName + ' has connected\n');
//     client.write(`Welcome to the chat room!\n`);

//     client.on('data', data => {
//        let message = userName + '> ' + data.toString().trim() + '\n';
//        messages(userName, message);

//        // Log it to the server output
//        process.stdout.write(message);
//     })
//     // client.on('end', () => {
//     //     console.log('userwhatever disconnected');
//     // });



//     function messages(from, message) {

//         sockets.forEach(function(client, index, array){
//             // Dont send any messages to the sender
//             if(client.userName === from) return;
            
//             client.write(message);
        
//         });
        
//     };

//     function removeUser(client) {

//         sockets.splice(sockets.indexOf(client), 1);

    
//     };

//     client.on('end', function() {

// 		let quitMessage = userName + ' left this chat\n';

// 		// Log it to the server output
// 		process.stdout.write(quitMessage);

// 		// Remove client from socket array
// 		removeUser(client);

// 		// Notify all clients
// 		messages(userName, quitMessage);
// 	});


// 	// When socket gets errors
// 	client.on('error', function(error) {

// 		console.log('problems: ', error.message);

// 	});




// }).listen(5000);
// console.log(`Listening on port ${server.address().port}`);
