'use strict';

// node modules
const net = require('net');
const EE = require('events');

// npm modules
// app modules
const Client = require('./model/client.js');

// env vars
const PORT = process.env.PORT || 3000;

// module constants
const pool = [];
const server = net.createServer();
const ee = new EE();

// changes user nickname if it isn't already taken
ee.on('\/nick', function(client, string){
  for (var i = 0; i < pool.length; i++) {
    if(string.trim() === pool[i].nickname) {
      client.socket.write(`${string} already exists. Please choose a different nickname`);
      return;
    }
    pool[i].socket.write(`${client.nickname} has changed their nickname to ` + string +'\n');
  }
  client.nickname = string.trim();
});

// sends message to all room participants
ee.on('\/all', function(client, string){
  pool.forEach( c => {
    c.socket.write(`${client.nickname}:` + string);
  });
});

// displays all current members of the chatroom
ee.on('\/room', function(client){
  client.socket.write('Current Participants:\n');
  for (var i = 0; i < pool.length; i++) {
    client.socket.write(`${pool[i].nickname}\n`);
  }
});

// displays a list of user / commands
ee.on('\/help', function(client, string){
  client.socket.write('User Chat Commands:\n');
  for (var i = 0; i < pool.length; i++) {
    client.socket.write(`
      /all [message] <--sends chat to room\n
      /nick [nickname] <--changes current nickname\n
      /room <--displays all current room participants\n
      /dm [username] <--sends direct message to only specified user\n`);
  }
});

ee.on('\/dm', function(client, string){
  for (var i = 0; i < pool.length; i++) {
    if (string.split(' ')[0] === pool[i].nickname) {
      client.socket.write(`${client.nickname}(DM to ${pool[i].nickname}):` + string.split(' ').slice(1).join(' '));
      pool[i].socket.write(`(DM from ${client.nickname}):` + string.split(' ').slice(1).join(' '));
      return;
    }
  }
  client.socket.write(`Sorry, ${client.nickname}, that is not a valid user to DM.`);
});

ee.on('default', function(client, string){
  client.socket.write('not a command');
});

// module logic
server.on('connection', function(socket){
  var client = new Client(socket);
  pool.push(client);
  for (var i = 0; i < pool.length; i++) {
    pool[i].socket.write(`${client.nickname} has joined the chat!\n`);
  }
  socket.on('data', function(data) {
    const command = data.toString().split(' ').shift().trim();

    if (command.startsWith('\/')) {
      ee.emit(command, client, data.toString().split(' ').slice(1).join(' '));
      return;
    }
    ee.emit('default', client, data.toString());
  });
  socket.on('error', function(error) {

  });
  socket.on('close', function(){
    ee.emit('');
  });
});

server.listen(PORT, function(){
  console.log('server running on port', PORT);
});
