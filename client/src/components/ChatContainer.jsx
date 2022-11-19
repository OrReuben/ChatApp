import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import Logout from "./Logout";
import { BiMenu } from "react-icons/bi";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import {
  sendMessageRoute,
  recieveMessageRoute,
  removeFriendRoute,
} from "../utils/APIRoutes";
import { FiUserX } from "react-icons/fi";
import { IoRemoveSharp } from "react-icons/io5";
export default function ChatContainer({
  currentChat,
  socket,
  showMobileChat,
  setShowMobileChat,
}) {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [currentUserId, setCurrentUserId] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const getMessages = async () => {
      const data = await JSON.parse(
        localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
      );
      setCurrentUserId(data._id);
      const response = await axios.post(recieveMessageRoute, {
        from: data._id,
        to: currentChat.UID,
      });
      setMessages(response.data);
    };
    getMessages();
  }, [currentChat]);

  useEffect(() => {
    const getCurrentChat = async () => {
      if (currentChat) {
        await JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        )._id;
      }
    };
    getCurrentChat();
  }, [currentChat]);

  const handleSendMsg = async (msg) => {
    const data = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    socket.current.emit("send-msg", {
      to: currentChat.UID,
      from: data._id,
      msg,
    });
    await axios.post(sendMessageRoute, {
      from: data._id,
      to: currentChat.UID,
      message: msg,
    });

    const msgs = [...messages];
    msgs.push({ fromSelf: true, message: msg });
    setMessages(msgs);
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  }, [socket]);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleUnfriend = async () => {
    try {
      await axios.post(`${removeFriendRoute}`, {
        _id: currentUserId,
        UID: currentChat.UID,
      });
      window.location.reload();
    } catch {}
  };
  return (
    <Container showMobileChat={showMobileChat && 1}>
      {open && (
        <div className="modal">
          <button className="modal-cancel" onClick={() => setOpen(false)}>
            <IoRemoveSharp />
          </button>
          Are you sure you want to remove this friend?
          <div className="modal-btn" onClick={() => handleUnfriend()}>
            CONFIRM
          </div>
        </div>
      )}
      <div className="chat-header">
        <div className="user-details">
          {window.innerWidth <= 600 && (
            <button
              onClick={() => {
                setShowMobileChat(false);
              }}
            >
              <BiMenu />
            </button>
          )}
          <div className="current-user-container">
            <div className="avatar">
              <img
                src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
                alt=""
              />
            </div>
            <div className="username">
              <h3>{currentChat.username}</h3>
            </div>
          </div>
        </div>
        <div className="btn-container">
          <button className="remove-btn" onClick={() => setOpen(true)}>
            <FiUserX />
          </button>
          <Logout />
        </div>
      </div>
      <div className="chat-messages">
        {messages.map((message) => {
          return (
            <div ref={scrollRef} key={uuidv4()}>
              <div
                className={`message ${
                  message.fromSelf ? "sended" : "recieved"
                }`}
              >
                <div className="content ">
                  <p>{message.message}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <ChatInput handleSendMsg={handleSendMsg} />
    </Container>
  );
}

const Container = styled.div`
  display: ${(props) =>
    window.innerWidth <= 600
      ? props.showMobileChat === 1
        ? "grid"
        : "none"
      : "grid"};
  grid-template-rows: 15% 75% 10%;
  gap: 0.1rem;
  overflow: hidden;
  position: relative;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  .modal {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    height: 60%;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background-color: #9a86f3ae;
    z-index: 10;
    box-shadow: 24px;
    padding: 4;
    text-align: center;
    .modal-cancel {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0.5rem;
      border-radius: 0.5rem;
      background-color: red;
      margin-right: 10px;
      border: none;
      cursor: pointer;
      color: white;
      position: absolute;
      top: 1rem;
      right: 0.5rem;
    }
    .modal-btn {
      margin-top: 20px;
      background-color: #9a86f3;
      padding: 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 15px;
      color: white;
      cursor: pointer;
    }
  }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      button {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0.5rem;
        border-radius: 0.5rem;
        background-color: #9a86f3;
        border: none;
        cursor: pointer;
        svg {
          font-size: 1.3rem;
          color: #ebe7ff;
        }
      }
      .current-user-container {
        display: flex;
        align-items: center;
        justify-content: center;
        @media screen and (max-width: 520px) {
          flex-direction: column;
        }
        .avatar {
          img {
            height: 3rem;
            margin-right: 10px;
            @media screen and (max-width: 520px) {
              margin-right: 0;
              margin-bottom: 5px;
              height: 2rem;
            }
          }
        }
        .username {
          h3 {
            color: white;
            @media screen and (max-width: 520px) {
              font-size: 15px;
            }
          }
        }
      }
    }
    .btn-container {
      display: flex;
      align-items: center;
      justify-content: center;

      .remove-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0.5rem;
        border-radius: 0.5rem;
        background-color: red;
        margin-right: 10px;
        border: none;
        cursor: pointer;
        color: #ebe7ff;
        font-size: 1.3rem;
        @media screen and (max-width: 520px) {
          font-size: 1rem;
        }
      }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: #4f04ff21;
      }
    }
    .recieved {
      justify-content: flex-start;
      .content {
        background-color: #9900ff20;
      }
    }
  }
`;
