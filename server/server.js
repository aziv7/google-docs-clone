const express = require('express');
require('dotenv').config();
const cors = require('cors');
const Document = require('./Schemas/document');
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
  socket.on('fetch-doc', async (data) => {
    console.log(data);
    let doc = await Document.findById(data.docId);

    if (!doc) {
      doc = new Document({ _id: data.docId, data: '' });
    }

    socket.join(data.docId);
    socket.emit('get-doc', doc.data);
    socket.on('text-editor-changes', (changes) => {
      console.log(changes);

      socket.broadcast.to(data.docId).emit('changes-received', changes);
    });

    socket.on('save-doc', async (updates) => {
      let doc = await Document.findByIdAndUpdate(data.docId, updates);
    });
  });
});

server.listen(config.APP_PORT, () => {
  console.log('App running');
});
