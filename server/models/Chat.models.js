const mongoose = require("mongoose");
const { Schema } = mongoose;

const MessagePartSchema = new Schema({
    text: {
        type: String,
        required: true,
    },
}, { _id: false });

// Define the structure for a full turn (user or model)
const ChatTurnSchema = new Schema({
    role: {
        type: String,
        enum: ['user', 'model'], 
        required: true,
    },
    parts: [MessagePartSchema], 
}, { _id: false });

// --- Main Chat Schema ---
const ChatSchema = new Schema({
    // Store the ID of the user who owns this chat session
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    title : String,
    // The entire conversation history
    chatHistory: {
        type: [ChatTurnSchema], 
        default: [],
    },
    lastUpdated: { 
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model("Chat", ChatSchema);