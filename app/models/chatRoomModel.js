const mongoose = require('mongoose');

const chatRoomSchema = new mongoose.Schema({
    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    lastMessage: { type: Schema.Types.ObjectId, ref: 'Message' }
}, { timestamps: true });

module.exports = mongoose.model('ChatRoom', chatRoomSchema);