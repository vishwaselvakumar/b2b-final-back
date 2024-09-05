const messageModel = require("../Models/messageModel");
module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message, finalamount, role } = req.body;
    console.log("from", from);
    console.log("to", to);
    console.log("message", message);
    console.log("finalamunt", finalamount);
    let messageContent = message;

    // If the role is 'admin' and finalamount is provided
    if (role==="admin" && finalamount) {
      messageContent = `Final Amount: ${finalamount}`;
    }

    const data = await messageModel.create({
      message: { text: messageContent },
      users: [from, to],
      sender: from,
    });

    if (data) return res.json({ msg: "Message added successfully" });
    return res.json({ msg: "Failed to add message in database" });
  } catch (error) {
    next(error);
  }
};

module.exports.getAllMessage = async (req, res, next) => {
  try {
    const { from, to } = req.body;
    const messages = await messageModel
      .find({
        users: {
          $all: [from, to],
        },
      })
      .sort({ updatedAt: 1 });
    const projectMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });
    res.json(projectMessages);
  } catch (error) {
    next(error);
  }
};
