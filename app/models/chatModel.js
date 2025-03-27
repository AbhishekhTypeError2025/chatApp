const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    chatRoom: { type: Schema.Types.ObjectId, ref: 'ChatRoom', required: true },
    content: { type: String, required: true },
    isEdited: { type: Boolean, default: false },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    replyTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Message', default: null }
}, { timestamps: true });

const userModel = mongoose.model('Message', messageSchema);

module.exports = userModel;