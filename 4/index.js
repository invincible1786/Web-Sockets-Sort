const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from the public folder
app.use(express.static('public'));

// Store active cursor positions and assigned colors per socket
const users = {};

// Helper to generate a random bright color for each cursor
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Assign a color and initial state for this socket
  users[socket.id] = {
    color: getRandomColor(),
    x: 0,
    y: 0
  };

  // 1. Send existing cursors state to the newly connected client
  socket.emit('init-cursors', users);

  // 2. Notify other clients that a new user joined
  socket.broadcast.emit('user-joined', {
    id: socket.id,
    color: users[socket.id].color
  });

  // 3. Listen for mousemove coordinates from client
  socket.on('mousemove', (coords) => {
    if (users[socket.id]) {
      users[socket.id].x = coords.x;
      users[socket.id].y = coords.y;

      // Broadcast the updated cursor position to ALL OTHER clients
      socket.broadcast.emit('cursor-update', {
        id: socket.id,
        x: coords.x,
        y: coords.y
      });
    }
  });

  // 4. Handle disconnection & cleanup
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    delete users[socket.id];
    
    // Tell other clients to remove this cursor dot
    io.emit('user-disconnected', socket.id);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});