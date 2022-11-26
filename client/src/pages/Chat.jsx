import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import styled from "styled-components";
import { findUserRoute, host } from "../utils/APIRoutes";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";

export default function Chat() {
  const navigate = useNavigate();
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const Redirection = async () => {
      if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
        navigate("/login");
      } else {
        setLoading(true)
        setCurrentUser(
          await JSON.parse(
            localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
          )
        );
      }
    };
    Redirection();
  }, [navigate]);

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  useEffect(() => {
    const Redirection = async () => {
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          setLoading(true)
          await axios
            .get(
              `${findUserRoute}?username=${currentUser.username.toLowerCase()}`
            )
            .then((res) => setContacts(res.data[0].friends))
            setLoading(false)
        } else {
          navigate("/setAvatar");
        }
      }
    };
    Redirection();
  }, [currentUser, navigate]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  
  return (
    <>
      <Container>
        <div className="container">
          <Contacts
            contacts={contacts}
            changeChat={handleChatChange}
            setShowMobileChat={setShowMobileChat}
            showMobileChat={showMobileChat}
            setContacts={setContacts}
            loadingContacts={loading}
          />
          {currentChat === undefined ? (
            <Welcome />
          ) : (
            <ChatContainer
              currentChat={currentChat}
              socket={socket}
              showMobileChat={showMobileChat}
              setShowMobileChat={setShowMobileChat}
            />
          )}
        </div>
      </Container>
    </>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  background-color: #131324;

  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 600px) and (max-width: 1080px) {
      grid-template-columns: 40% 60%;
    }
    @media screen and (max-width: 600px) {
      height: 90vh;
      width: 95vw;
      background-color: #00000076;
      display: grid;
      grid-template-columns: 100%;
    }
  }
`;
