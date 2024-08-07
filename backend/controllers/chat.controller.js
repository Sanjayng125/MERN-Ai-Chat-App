import { Chat } from "../models/Chat.js";
import { UserChats } from "../models/UserChats.js";

export const chat = async (req, res) => {
  const userId = req.auth.userId;
  const { text } = req.body;

  try {
    // CREATE A NEW CHAT
    const newChat = new Chat({
      userId: userId,
      history: [{ role: "user", parts: [{ text }] }],
    });

    const savedChat = await newChat.save();

    // CHECK IF THE USERCHATS EXISTS
    const userChats = await UserChats.find({ userId: userId });

    // IF DOESN'T EXIST CREATE A NEW ONE AND ADD THE CHAT IN THE CHATS ARRAY
    if (!userChats.length) {
      const newUserChats = new UserChats({
        userId: userId,
        chats: [
          {
            _id: savedChat._id,
            title: text.substring(0, 40),
          },
        ],
      });

      await newUserChats.save();
    } else {
      // IF EXISTS, PUSH THE CHAT TO THE EXISTING ARRAY
      await UserChats.updateOne(
        { userId: userId },
        {
          $push: {
            chats: {
              _id: savedChat._id,
              title: text.substring(0, 40),
            },
          },
        }
      );

      res.status(201).send(newChat._id);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Error creating chat!");
  }
};

export const getUserChats = async (req, res) => {
  const userId = req.auth.userId;
  try {
    const userChats = await UserChats.find({ userId });

    if (!userChats || !userChats.length === 0) {
      return res.status(200).send(null);
    }

    return res.status(200).send(userChats[0]?.chats);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error Getting User Chats: ", error);
  }
};

export const getChat = async (req, res) => {
  const userId = req.auth.userId;
  try {
    const chat = await Chat.findOne({ _id: req.params.id, userId: userId });

    return res.status(200).send(chat);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error Fetching Chat: ", error);
  }
};

export const updateChat = async (req, res) => {
  const userId = req.auth.userId;
  const { question, answer, image } = req.body;

  const newItems = [
    ...(question
      ? [{ role: "user", parts: [{ text: question }], ...(image && { image }) }]
      : []),
    { role: "model", parts: [{ text: answer }] },
  ];

  try {
    const updatedChat = await Chat.updateOne(
      { _id: req.params.id, userId: userId },
      {
        $push: {
          history: {
            $each: newItems,
          },
        },
      }
    );

    return res.status(200).send(updatedChat);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error adding conversation: ", error);
  }
};
