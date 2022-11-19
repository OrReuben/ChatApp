import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Logo from "../assets/logo.svg";
import { FaUserFriends } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { findUserRoute } from "../utils/APIRoutes";

export default function Contacts({
  contacts,
  changeChat,
  setShowMobileChat,
  showMobileChat,
}) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const [friendRequestCounter, setFriendRequestCounter] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const setUserInfo = async () => {
      setLoading(true);
      const data = await JSON.parse(
        localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
      );
      setCurrentUserName(data.username);
      setCurrentUserImage(data.avatarImage);
      setLoading(false);
    };
    setUserInfo();
  }, []);
  const changeCurrentChat = (index, contact) => {
    window.innerWidth <= 600 && setShowMobileChat(true);
    setCurrentSelected(index);
    changeChat(contact);
  };

  useEffect(() => {
    const getUserFriendRequests = async () => {
      const user = await axios.get(
        `${findUserRoute}?username=${currentUserName?.toLowerCase()}`
      );
      !loading &&
        user &&
        setFriendRequestCounter(user.data[0].friendRequests.length);
    };
    getUserFriendRequests();
  }, [currentUserName, loading]);
  return (
    <>
      {currentUserImage && currentUserImage && (
        <Container showMobileChat={showMobileChat && 1}>
          <div className="brand">
            <button onClick={() => navigate("/add-friend")}>
              <FaUserFriends />
            </button>
            {friendRequestCounter !== 0 && (
              <div className="user-friend-requests">
                {friendRequestCounter && friendRequestCounter}
              </div>
            )}
            <img src={Logo} alt="logo" />
            <h3>chatib</h3>
          </div>
          <div className="contacts">
            {contacts.map((contact, index) => {
              return (
                <div
                  key={contact._id}
                  className={`contact ${
                    index === currentSelected ? "selected" : ""
                  }`}
                  onClick={() => changeCurrentChat(index, contact)}
                >
                  <div className="avatar">
                    <img
                      src={`data:image/svg+xml;base64,${contact?.avatarImage}`}
                      alt=""
                    />
                  </div>
                  <div className="username">
                    <h3>{contact.username}</h3>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="current-user">
            <div className="avatar">
              <img
                src={`data:image/svg+xml;base64,${currentUserImage}`}
                alt="avatar"
              />
            </div>
            <div className="username">
              <h2>{currentUserName}</h2>
            </div>
          </div>
        </Container>
      )}
    </>
  );
}
const Container = styled.div`
  display: ${(props) => (props.showMobileChat === 1 ? "none" : "grid")};
  grid-template-rows: 10% 75% 15%;
  overflow: hidden;
  background-color: #080420;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    position: relative;
    button {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0.5rem;
      border-radius: 0.5rem;
      background-color: #9a86f3;
      border: none;
      cursor: pointer;
      position: absolute;
      top: 0.7rem;
      left: 1rem;
      color: white;
    }
    .user-friend-requests {
      border-radius: 50%;
      background-color: red;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 17px;
      height: 17px;
      font-size: 13px;
      top: 0.3rem;
      left: 0.5rem;
      position: absolute;
      color: white;
    }
    img {
      height: 2rem;
    }
    h3 {
      color: white;
      text-transform: uppercase;
    }
  }
  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap: 0.8rem;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    @media screen and (max-width: 600px) {
      width: 85vw;
    }
    .contact {
      background-color: #ffffff34;
      min-height: 5rem;
      cursor: pointer;
      width: 90%;
      border-radius: 0.2rem;
      padding: 0.4rem;
      display: flex;
      gap: 1rem;
      align-items: center;
      transition: 0.5s ease-in-out;

      @media screen and (max-width: 850px) {
        flex-direction: column;
        gap: 0.2rem;
      }
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
        @media screen and (max-width: 850px) {
          font-size: 13px;
        }
      }
    }
    .selected {
      background-color: #9a86f3;
    }
  }

  .current-user {
    background-color: #0d0d30;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    .avatar {
      img {
        height: 4rem;
        max-inline-size: 100%;
      }
      @media screen and (max-width: 850px) {
        img {
          height: 3rem;
        }
      }
    }
    .username {
      h2 {
        color: white;
      }
    }
    @media screen and (max-width: 850px) {
      gap: 0.5rem;
      .username {
        h2 {
          font-size: 1rem;
        }
      }
    }
  }
`;
