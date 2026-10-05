import express from 'express'
import {createServer} from 'node:http'
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {Server} from 'socket.io';

const app = express();
const port = 3000;
const server = createServer(app);
const io = new Server(server)

const __dirname = dirname(fileURLToPath(import.meta.url));

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
})

io.on('connection', (socket) => {
    console.log("user detected");
    // console.log("user detected", socket.id); = better practice !!
    socket.on('pingg', (start_time)=>{
        socket.emit('pongg', start_time)
    });

  socket.on('disconnect', ()=>{
    console.log("buh bye my pretty");
  });
});  

server.listen(port, () => {
  console.log(`server on port ${port}`)
})