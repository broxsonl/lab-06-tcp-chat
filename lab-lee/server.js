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

ee.on('\\nick', function(client, string){
  client.nickname = string.trim();
});

ee.on('\\all', function(client, string){
  pool.forEach( c => {
    c.socket.write(`${client.nickname}:` + string);
  });
});

ee.on('\\dm', function(client, string){
  for (var i = 0; i < pool.length; i++) {
    if (string.split(' ')[0] === pool[i].nickname) {
      client.socket.write(`${client.nickname}(DM):` + string);
      pool[i].socket.write(`(DM from ${client.nickname}):` + string);
    }
  }
    // else {
    //   client.socket.write(`Sorry, ${client.nickname}, that is not a valid user to DM.`);
  // }
});

ee.on('default', function(client, string){
  client.socket.write('not a command');
});

// module logic
server.on('connection', function(socket){
  var client = new Client(socket);
  pool.push(client);
  socket.on('data', function(data) {
    const command = data.toString().split(' ').shift().trim();

    if (command.startsWith('\\')) {
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
