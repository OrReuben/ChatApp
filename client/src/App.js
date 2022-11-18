import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SetAvatar from "./components/SetAvatar";
import AddFriend from "./pages/AddFriend";
import Chat from "./pages/Chat";
import FriendRequest from "./pages/FriendRequests";
import Login from "./pages/Login";
import Register from "./pages/Register";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/setAvatar" element={<SetAvatar />} />
        <Route path="/" element={<Chat />} />
        <Route path="/add-friend" element={<AddFriend />} />
        <Route path="/friend-requests" element={<FriendRequest />} />
      </Routes>
    </BrowserRouter>
  );
}
