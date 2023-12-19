const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const PORT = 3000;

http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Socket 
io.on('connection', (socket) => {
    console.log('Connected...');

    // Notify user joined
    socket.on('userJoined', (userName) => {
        socket.userName = userName;
        io.emit('userJoined', userName);
    });

    // Notify user left
    socket.on('disconnect', () => {
        const userName = socket.userName;
        if (userName) {
            io.emit('userLeft', userName);
        }
    });

    socket.on('message', (msg) => {
        socket.userName = msg.user;
        socket.broadcast.emit('message', msg);
    });
});
