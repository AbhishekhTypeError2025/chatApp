const chatRoomSchema = new Schema({
    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    lastMessage: { type: Schema.Types.ObjectId, ref: 'Message' }
}, { timestamps: true });

const ChatRoom = model('ChatRoom', chatRoomSchema);

module.exports = ChatRoom;