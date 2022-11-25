const {
  login,
  register,
  getAllUsers,
  setAvatar,
  logOut,
  getAllUsersFiltered,
  addFriend,
  putUser,
  friendRequest,
  removeFriend,
  declineFriendRequest,
} = require("../controllers/userController");

const router = require("express").Router();

router.post("/login", login);
router.post("/register", register);
router.get("/allusers/:id", getAllUsers);
router.get("/findusers", getAllUsersFiltered);
router.post("/setavatar/:id", setAvatar);
router.post("/friendrequest", friendRequest);
router.post("/addfriend", addFriend);
router.post("/removefriend", removeFriend);
router.post("/declinefriendrequest", declineFriendRequest);
router.put("/putuser", putUser);
router.get("/logout/:id", logOut);

module.exports = router;
