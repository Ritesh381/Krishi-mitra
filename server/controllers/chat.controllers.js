const Chat = require("../models/Chat.models");
const { chatModel } = require("../config/ai");
const prompts = require("../config/prompts");

const systemInstruction = {
  role: "user",
  parts: [{ text: prompts.chatInit }],
};

const create_chat = async (req, res) => {
  const userId = req.user.id;

  if (!userId) {
    return res
      .status(401)
      .json({
        success: false,
        error: "Authentication required (Missing userId).",
      });
  }

  try {
    const newChat = new Chat({
      userId,
      title: `Chat - ${new Date().toLocaleDateString()}`,
    });

    await newChat.save();

    return res.status(201).json({
      success: true,
      message: "New chat session created.",
      _id: newChat._id,
      title: newChat.title,
    });
  } catch (error) {
    console.error("Error creating chat:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to create new chat session." });
  }
};

const send_msg = async (req, res) => {
  const userId = req.user.id;
  const { chatId, message } = req.body;

  if (!userId || !chatId || !message) {
    return res
      .status(400)
      .json({ success: false, error: "Missing chatId, userId, or message." });
  }

  try {
    let chat = await Chat.findById(chatId);

    if (!chat) {
      return res
        .status(404)
        .json({ success: false, error: "Chat session not found." });
    }

    if (chat.userId.toString() !== userId) {
      return res.status(403).json({ success: false, error: "Access denied." });
    }

    const newUserMessage = {
      role: "user",
      parts: [{ text: message }],
    };

    let conversationHistory = [systemInstruction];
    conversationHistory = conversationHistory.concat(chat.chatHistory);
    conversationHistory.push(newUserMessage);

    const modelReplyText = await chatModel(conversationHistory);

    const modelReply = {
      role: "model",
      parts: [{ text: modelReplyText }],
    };

    chat.chatHistory.push(newUserMessage, modelReply);
    chat.lastUpdated = new Date();

    await chat.save();

    return res.status(200).json({
      success: true,
      reply: modelReplyText,
      chatId: chat._id,
    });
  } catch (error) {
    console.error("Error in send_msg:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to generate response.",
      details: error.message,
    });
  }
};

const delete_chat = async (req, res) => {
  const userId = req.user.id;
  const { chatId } = req.body;

  if (!chatId || !userId) {
    return res
      .status(400)
      .json({ success: false, error: "Missing chatId or userId." });
  }

  try {
    const result = await Chat.findOneAndDelete({ _id: chatId, userId });

    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "Chat not found or access denied." });
    }

    return res
      .status(200)
      .json({ success: true, message: "Chat deleted successfully." });
  } catch (error) {
    console.error("Error in delete_chat:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to delete chat." });
  }
};

const get_all_chats = async (req, res) => {
  const userId = req.user.id;

  if (!userId) {
    return res
      .status(401)
      .json({
        success: false,
        error: "Authentication required (Missing userId).",
      });
  }

  try {
    const chats = await Chat.find({ userId })
      .select("_id title lastUpdated")
      .sort({ lastUpdated: -1 });

    return res.status(200).json({ success: true, chats });
  } catch (error) {
    console.error("Error in get_all_chats:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to retrieve chat list." });
  }
};

const get_history = async (req, res) => {
  const { chatId } = req.query;

  if (!chatId) {
    return res.status(400).json({ success: false, error: "Missing chatId." });
  }

  try {
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res
        .status(404)
        .json({ success: false, message: "Chat session not found." });
    }

    return res.status(200).json({
      success: true,
      history: chat.chatHistory,
      chatId: chat._id,
    });
  } catch (error) {
    console.error("Error in get_history:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to retrieve history." });
  }
};

module.exports = {
  create_chat,
  send_msg,
  get_all_chats,
  get_history,
  delete_chat,
};
