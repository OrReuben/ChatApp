const User = require("../models/userModel");
const bcrypt = require("bcrypt");

module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user)
      return res.json({ msg: "Incorrect Username or Password", status: false });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.json({ msg: "Incorrect Username or Password", status: false });
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck)
      return res.json({ msg: "Username already used", status: false });
    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.json({ msg: "Email already used", status: false });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
    ]);
    return res.json(users);
  } catch (ex) {
    next(ex);
  }
};

module.exports.putUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.body.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports.getAllUsersFiltered = async (req, res, next) => {
  const query = req.query.username;
  try {
    const search = (users) => {
      return users.filter((user) =>
        user.username.toLowerCase().includes(query)
      );
    };
    const usersFiltered = await User.find({}).then((data) =>
      res.json(search(data))
    );

    return res.json(usersFiltered);
  } catch (ex) {
    next(ex);
  }
};

module.exports.friendRequest = async (req, res, next) => {
  const { username, _id, avatarImage, UID } = req.body;
  try {
    const checkIfAlreadyRequested = await User.find({
      _id,
      friendRequests: [{ UID }],
    }).then((res) => console.log(res.data));
    if (!checkIfAlreadyRequested) {
      const friendRequest = await User.updateOne(
        { _id },
        {
          $push: { friendRequests: [{ UID, avatarImage, username }] },
        }
      );
      return res.status(200).json(friendRequest);
    } else console.log(checkIfAlreadyRequested);
  } catch (ex) {
    next(ex);
  }
};

module.exports.addFriend = async (req, res, next) => {
  const {
    currentUserUsername,
    currentUserId,
    currentUserAvatarImage,
    requestedUserId,
    requestedUserUsername,
    requestedUserAvatarImage,
  } = req.body;
  try {
    await User.updateOne(
      { _id: currentUserId },
      {
        $pull: { friendRequests: { UID: requestedUserId } },
      }
    );
    await User.updateOne(
      { _id: currentUserId },
      {
        $push: {
          friends: [
            {
              UID: requestedUserId,
              avatarImage: requestedUserAvatarImage,
              username: requestedUserUsername,
            },
          ],
        },
      }
    );
    await User.updateOne(
      { _id: requestedUserId },
      {
        $push: {
          friends: [
            {
              UID: currentUserId,
              avatarImage: currentUserAvatarImage,
              username: currentUserUsername,
            },
          ],
        },
      }
    );
    return res.status(200).json("Request was successfully completed");
  } catch (ex) {
    next(ex);
  }
};

module.exports.removeFriend = async (req, res, next) => {
  const { _id, UID } = req.body;
  try {
    if ((_id, UID)) {
      await User.updateOne(
        { _id },
        {
          $pull: { friends: { UID } },
        }
      );
      await User.updateOne(
        { _id: UID },
        {
          $pull: { friends: { UID: _id } },
        }
      );
      return res.status(200).json("removeFriend");
    } else console.log("something went wrong");
  } catch (ex) {
    next(ex);
  }
};

module.exports.declineFriendRequest = async (req, res, next) => {
  const { username, _id, avatarImage, UID } = req.body;
  try {
    const removeFriend = await User.updateOne(
      { _id },
      {
        $pull: { friendRequests: { UID } },
      }
    );
    return res.status(200).json(removeFriend);
  } catch (ex) {
    next(ex);
  }
};

module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userData = await User.findByIdAndUpdate(
      userId,
      {
        isAvatarImageSet: true,
        avatarImage,
      },
      { new: true }
    );
    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (ex) {
    next(ex);
  }
};

module.exports.logOut = (req, res, next) => {
  try {
    if (!req.params.id) return res.json({ msg: "User id is required " });
    onlineUsers.delete(req.params.id);
    return res.status(200).send();
  } catch (ex) {
    next(ex);
  }
};
