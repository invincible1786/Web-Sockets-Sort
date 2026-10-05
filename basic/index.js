import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server);

const __dirname = dirname(fileURLToPath(import.meta.url));

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

// io.on('connection', (socket) => {
//   console.log('a user connected');
//   socket.on('disconnect', ()=>{
//     console.log("user disconnected")
//   });   
// });

// this will be here always as connection is always maintained only on server side


io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});

// Command            Location         Target / Scope
// ----------------------------------------------------------------------
// socket.emit()      Client or Server One-to-One
// socket.on()        Client or Server Single Connection
// io.emit()          Server only      All Connected Clients
// io.on()            Server only      Server-Wide Events

// one to one relation - client sending to server - each with a unique instance

// Client
socket.emit('hello', 'world');

// Server
io.on('connection', (socket) => {
  socket.on('hello', (arg) => {
    console.log(arg); // 'world'
  });
});

// one to one relation - server sending to client - each client with a different id

// // Server
// io.on('connection', (socket) => {
//   socket.emit('hello', 'world');
// });

// // Client
// socket.on('hello', (arg) => {
//   console.log(arg); // 'world'
// });

// https://socket.io/docs/v4/tutorial/api-overview - refer to this for using callback for sending requests and even for making rooms and all