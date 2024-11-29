const socketIo = require('socket.io');

function setupSocketServer(server) {
    const io = socketIo(server);

    io.on('connection', (socket) => {
        console.log('A client connected');
        
        socket.on('subscribe', (clientId) => {
            console.log(`Client ${clientId} subscribed to payment updates`);
            socket.join(clientId);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });

    return io;
}

function sendPaymentStatusToClient(io, clientId, paymentStatus) {
    io.to(clientId).emit('paymentStatusUpdate', paymentStatus);
}

module.exports = { setupSocketServer, sendPaymentStatusToClient };