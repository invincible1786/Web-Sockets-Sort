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

io.on("connection", (socket)=>{
    console.log("user connected", socket.id)
    socket.on("oth", (arg)=>{
      socket.broadcast.emit("msgg", arg);
    })
    socket.on("al", (arg)=>{
      io.emit("msgg", arg);
    })

  socket.on("disconnect", ()=>{
    console.log("user disconnected", socket.id);
  })
})

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});
