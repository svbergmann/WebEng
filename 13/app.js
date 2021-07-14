const express = require('express');
const path = require('path');
const port = 3000;
const ws = require('ws');
const WebSocket = require('ws');
const connectionHandler = require('./websockets/connection.js');

// Server
const app = express();
app.use(express.static("./websockets"));
app.get('/', (req, res) => {
    res.sendFile('index.html', {root: __dirname});
});

const wsServer = new ws.Server({noServer: true});

wsServer.on('connection', connectionHandler);
const server = app.listen(8080);
server.on('upgrade', (request, socket, head) => {
    wsServer.handleUpgrade(request, socket, head, socket => {
        wsServer.emit('connection', socket, request);
    });
});