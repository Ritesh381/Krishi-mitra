const express = require("express");
const {
  create_chat,
  send_msg,
  get_all_chats,
  get_history,
  delete_chat,
} = require("../controllers/chat.controllers");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/create", auth, create_chat);
router.get("/all", auth, get_all_chats);
router.delete("/delete", auth, delete_chat);
router.post("/send", auth, send_msg);
router.get("/history", auth, get_history);

module.exports = router;
