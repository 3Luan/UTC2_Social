const Chat = require("../models/chatModel");
const User = require("../models/userModel");

//@description     Create or fetch One to One Chat
//@route           POST /api/chat/
//@access          Protected
const accessChat = async (req, res) => {
  const { userId } = req.body;

  // Kiểm tra thông tin bắt buộc
  if (!userId) {
    console.log("UserId param not sent with request");
    return res.status(400).send({ message: "Thiếu thông tin userId" });
  }

  try {
    // Tìm cuộc trò chuyện giữa hai người dùng
    var isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.userId } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "name pic email",
    });

    if (isChat.length > 0) {
      // Nếu cuộc trò chuyện đã tồn tại
      return res.status(200).json(isChat[0]);
    }

    // Tạo cuộc trò chuyện mới nếu chưa có
    const chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.userId, userId],
    };

    const createdChat = await Chat.create(chatData);
    const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
      "users",
      "-password"
    );

    res.status(201).json(FullChat); // Thành công
  } catch (error) {
    res
      .status(500)
      .send({ message: "Đã xảy ra lỗi trên máy chủ", error: error.message });
  }
};

// //@description     Fetch all chats for a user
// //@route           GET /api/chat/
// //@access          Protected
const fetchChats = async (req, res) => {
  try {
    const results = await Chat.find({
      users: { $elemMatch: { $eq: req.userId } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .exec();

    await User.populate(results, {
      path: "latestMessage.sender",
      select: "name pic email",
    });

    if (!results || results.length === 0) {
      return res.status(404).send({ message: "No chats found" }); // Không tìm thấy dữ liệu
    }

    res.status(200).send(results); // Thành công
  } catch (error) {
    console.error(error); // Ghi lại lỗi để debug
    res.status(500).send({ message: "Internal Server Error" }); // Lỗi máy chủ
  }
};

// //@description     Create New Group Chat
// //@route           POST /api/chat/group
// //@access          Protected
const createGroupChat = async (req, res) => {
  try {
    // Kiểm tra các trường bắt buộc
    if (!req.body.users || !req.body.name) {
      return res.status(400).json({ message: "Please fill all the fields" }); // Lỗi yêu cầu không hợp lệ
    }

    let users;
    try {
      users = JSON.parse(req.body.users);
    } catch (error) {
      return res.status(400).json({ message: "Invalid users format" }); // Lỗi định dạng dữ liệu
    }

    // Kiểm tra số lượng người dùng
    if (users.length < 2) {
      return res.status(400).json({
        message: "At least 2 users are required to form a group chat",
      });
    }

    // Thêm người dùng hiện tại vào nhóm
    users.push(req.userId);

    // Tạo nhóm chat
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.userId,
    });

    // Tìm kiếm và populate thông tin nhóm chat đầy đủ
    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(201).json({ data: fullGroupChat });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// // @desc    Rename Group
// // @route   PUT /api/chat/rename
// // @access  Protected
const renameGroup = async (req, res) => {
  try {
    const { chatId, chatName } = req.body;

    // Check if chatName is provided
    if (!chatName) {
      return res.status(400).json({ message: "Chat name is required" });
    }

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        chatName: chatName,
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!updatedChat) {
      res.status(404);
      throw new Error("Chat Not Found");
    } else {
      res.json(updatedChat);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// // @desc    Remove user from Group
// // @route   PUT /api/chat/groupremove
// // @access  Protected
const removeFromGroup = async (req, res) => {
  try {
    const { chatId, userId } = req.body;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    // Find the chat and check if the user is in the group
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat Not Found" });
    }

    // Check if the user is part of the group
    if (!chat.users.includes(userId)) {
      return res.status(400).json({ message: "User is not in the group" });
    }

    // Remove the user from the group
    const removed = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.json(removed);
  } catch (error) {
    // Handle error
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// // @desc    Add user to Group / Leave
// // @route   PUT /api/chat/groupadd
// // @access  Protected
const addToGroup = async (req, res) => {
  try {
    const { chatId, userId } = req.body;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    // Find the chat and check if the user is already in the group
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat Not Found" });
    }

    // Check if the user is already in the group
    if (chat.users.includes(userId)) {
      return res.status(400).json({ message: "User is already in the group" });
    }

    // Add the user to the group
    const added = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.json(added);
  } catch (error) {
    // Handle error
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
