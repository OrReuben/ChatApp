const {
  login,
  register,
  getAllUsers,
  setAvatar,
  logOut,
  getAllUsersFiltered,
  addFriend,
  putUser,
} = require("../controllers/userController");

const router = require("express").Router();

router.post("/login", login);
router.post("/register", register);
router.get("/allusers/:id", getAllUsers);
router.get("/findusers", getAllUsersFiltered);
router.post("/setavatar/:id", setAvatar);
// router.post("/friendrequest", addFriend);
router.put("/putuser", putUser);
router.get("/logout/:id", logOut);

module.exports = router;
