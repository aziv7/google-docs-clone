const express = require('express');
require('dotenv').config();
const cors = require('cors');

const { config } = require('./config');

const server = express();
const http = require('http');
server.use(express.json());

server.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  })
);

server.get('/api', (req, res) => res.send('hello'));

const httpServer = http.createServer(server);
const io = require('socket.io')(4002, {
  cors: { origin: 'http://localhost:3000', methods: ['GET', 'POST'] },
});

io.on('connection', (socket) => {
  console.log('connected');
});

server.listen(config.APP_PORT, () => {
  console.log('App running');
});
