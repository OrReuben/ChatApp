export const host = "http://localhost:3003";
export const loginRoute = `${host}/api/auth/login`;
export const registerRoute = `${host}/api/auth/register`;
export const logoutRoute = `${host}/api/auth/logout`;
export const allUsersRoute = `${host}/api/auth/allusers`;
export const sendMessageRoute = `${host}/api/messages/addmsg`;
export const recieveMessageRoute = `${host}/api/messages/getmsg`;
export const setAvatarRoute = `${host}/api/auth/setavatar`;
export const findUserRoute = `${host}/api/auth/findusers`;
export const friendRequestRoute = `${host}/api/auth/friendrequest`;
export const confirmFriendRequestRoute = `${host}/api/auth/addfriend`;
export const declineFriendRequestRoute = `${host}/api/auth/declinefriendrequest`;
export const removeFriendRoute = `${host}/api/auth/removefriend`;