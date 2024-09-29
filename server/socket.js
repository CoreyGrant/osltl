const {Server} = require('socket.io');

// each user will have their own room, keyed on userId
// server will emit events to their room when a user's details have changed,
// prompting the other devices with the same user to update
class SocketServer {
    server;
    constructor(httpServer){
        this.server = new Server(httpServer);
        this.server.on('connection', socket => {
            console.log('new connection');
            socket.on('register', (userId) => {
                socket.join(userId);
                console.log('registered', userId);
            })
        })
    }
    dataUpdated(userId){
        this.server.in(userId).emit('update');
        console.log('data updated');
    }
}

module.exports = {
    SocketServer
}