const fs = require('fs');
const net = require('net');
const server = net.createServer();
const createFile = fs.createWriteStream('server.log');
let users = [];
let count = 1;
let password = '12345';


server.listen(6000, () => log('Server up on port: 6000'));

server.on('connection', socket => {
	socket.id = count++;
	socket.name = null;
	users.push(socket);
    socket.write('Welcome! type your username and hit enter to get started');
	
	socket.on('data', chunk => {
		chunk = chunk.toString().trim();
		if( socket.name === null){
			setUsername(socket, chunk)
		} else if(chunk[0] === '/'){
			commands(socket, chunk);
		} else {
			log(`${socket.name}: ${chunk}`)
			announce(socket.name, `${socket.name}: ${chunk}`);
		}

	})
	.on('end', () => {
		removeUser(socket.name)
		})
	})

	function setUsername(socket,chunk){
		socket.name = chunk;
		if(users.length > 0) connectedUsers = clientlist(socket);
		socket.write(`welcome ${socket.name}. type /quit to end session`)
		connectMsg(socket);
	}

	function connectMsg(socket) {
		let success = `${socket.name} has connected`;
		announce(socket.name, success);
		log(success);
	}

	function commands(socket, chunk) {
		chunk = chunk.slice(1);
		chunk = chunk.split(' ');
		let command = chunk.shift();
		let name = chunk.shift();
		let message = chunk.join(' ');
		// https://www.w3schools.com/js/js_switch.asp remember this
		switch(command) {
			case 'help':
				socket.write('/w {name} "message"\n/username {new name}\n/kick {name} {admin password}\n/quit to exit chat session.')
				break;
			case 'w':
				if(socket.name != name){
				let whisper = socket.name + ' whispers: ' + message;
				findUser(name).write(whisper);
				log(whisper);
				} else {
					socket.write('you cannot whisper to yourself.')
				}
				break;
			case 'username':
				let oldName = socket.name;
				socket.name = name;
				socket.write('Username has be changed to: ' + socket.name);
				let logMessage = `User (${oldName}) has changed their username to: ${socket.name}`;
				announce(socket.name, logMessage);
				log(logMessage);
				break;
			case 'kick':
				if(message === password && socket.name != name) {
					let kickedUser = findUser(name);
					kickedUser.write('You have been removed from chat');
					kickedUser.end();
					removeUser(name);
					let kickMessage = kickedUser.name + ' has been removed from the chat';
					announce(kickedUser.name, kickMessage);
					log(kickMessage);
				}else if(socket.name = name){
					 socket.write('You cannot /kick yourself! type /quit to exit chat');
					 break;
				}
				else socket.write('Only users with the admin password may kick users!');
				break;
			case 'clientlist':
				socket.write('Connected Users:\n');
				socket.write(clientlist(socket));
				break;
			default:
				socket.write('Unknown command, type /help for command options\n');
				break;
		}
	}
	
	function findUser(username) {
		for (let i in users) {
			if(users[i].name === username) return users[i];
		}
		return null;
	}
	
	function announce(username, message) {
		for (let i in users) {
			if (users[i].name !== username) users[i].write(message);
		}
	}
	
	function removeUser(name) {
		for (let i in users) {
			if (users[i].name === name) {
				users.splice(i, 1);
			}
		}
		log(`${name} has disconnected`);
	}
	
	function clientlist(socket) {
		connectedUsers = '';
		for (let i in users) {
			if(users[i].id !== socket.id) connectedUsers += users[i].name + ', ';
		}
		connectedUsers += socket.name;
		return connectedUsers;
	}
	
	function log(message) {
		console.log(message);
		createFile.write(message + '\n');
	}

