const jwt = require('jsonwebtoken');
const { chatModel }=require('../models/index')
function setupSocket(io) {

    // Authentication Socket.IO connections
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) return next(new Error('Token is not provided'));
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) return next(new Error('Authentication error'));
            socket.userId = decoded.userId;
            next();
        });
    });

    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.userId}`);

        //insert
        socket.on('newMessage', async (data) => {

            const { sender, content, receiver } = data;

            const doc = new chatModel.Message({
                conversationId: data.conversationId,
                sender: sender,
                receiver: receiver,
                content: content
            });


            doc.save();
            socket.broadcast.emit('newMessage', data);
        });

        // update
        socket.on('updateMessage', async (data) => {

            const { messageId, content, receiver } = data;
            try {
                const updatedMessage = await Message.findByIdAndUpdate(
                    messageId,
                    { content, edited: true },
                    { new: true }
                );
                socket.broadcast.to(receiver).emit('messageUpdated', updatedMessage);
            } catch (error) {
                socket.emit('error', { error: 'Could not update message' });
            }
        });

        socket.on('deleteMessage', async (data) => {

            const { messageId } = data;
            try {
                await Message.findByIdAndDelete(messageId);
                socket.broadcast.emit('messageDeleted', { messageId });
            } catch (error) {
                socket.emit('error', { error: 'Could not delete message' });
            }
        });

    });
}

module.exports = { setupSocket };
