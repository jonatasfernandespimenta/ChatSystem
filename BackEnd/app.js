const express = require('express');
const socket = require('socket.io');
const http = require('http');

const expressInstance = express();

const server = http.createServer(expressInstance);
const io = socket(server, { wsEngine: 'ws' });

let messages = [];

io.on('connection', socket => {
    console.log(`Socket conectado ${socket.id}`);
    socket.emit('prevMsg', messages);

    socket.on('message', data => {
        messages.push(data);

        if(messages.length >= 10) {
          messages = messages.slice(10, messages.length);
        }
        
        socket.broadcast.emit('messageSend', data);
    })

})

server.listen(3000);
