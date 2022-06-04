const express = require('express');
require('dotenv').config();
const cors = require('cors');

const { config } = require('./config');

const server = express();
const http = require('http').Server(server);
server.use(express.json());

server.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  })
);

const io = require('socket.io')(http, {
  cors: { origin: 'http://localhost:3000', methods: ['GET', 'POST'] },
});

io.on('connection', (socket) => {
  console.log('connected');
});

app.listen(config.APP_PORT, () => {
  console.log('App running');
});
