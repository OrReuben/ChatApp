import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Logo from "../assets/logo.svg";
import { FaUserFriends } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { findUserRoute } from "../utils/APIRoutes";
import { AiOutlineSearch } from "react-icons/ai";
import Logout from "../components/Logout";
import robot from "../assets/robot.gif";

export default function Contacts({
  contacts,
  changeChat,
  setShowMobileChat,
  showMobileChat,
  setContacts,
}) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const [filteredContacts, setFilteredContacts] = useState([]);
  // const [query, setQuery] = useState("");
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
    setFilteredContacts(contacts);
  }, [contacts]);
  const searchContacts = (query) => {
    if (query.length > 0) {
      const searchedContacts = [];
      contacts.map(
        (contact) =>
          contact.username.toLowerCase().includes(query) &&
          searchedContacts.push(contact)
      );
      setFilteredContacts(searchedContacts);
    } else setFilteredContacts(contacts);
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
            <div style={{ position: "absolute", top: 0, right: "4rem" }}>
              <Logout />
            </div>
            <img src={Logo} alt="logo" />
            <h3>chatib</h3>
          </div>
          <div className="search-container">
            <input
              type="text"
              placeholder="Looking for someone?.."
              onChange={(e) => searchContacts(e.target.value)}
            />
            <AiOutlineSearch />
          </div>
          <div className="contacts">
            {filteredContacts.length === 0 ? (
              <div className="no-contacts-container">
                <img src={robot} alt="" />
                <h2>Hello there, {currentUserName}</h2>
                <br />
                <h3>Seems like you're alone..</h3>
                <div onClick={() => navigate('/add-friend')}>Click me!</div>
              </div>
            ) : (
              filteredContacts.map((contact, index) => {
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
              })
            )}
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
  grid-template-rows: 10% 5% 70%;
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
  .search-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    position: relative;
    input {
      width: 90%;
      height: 100%;
      margin-bottom: 0.5rem;
      background-color: #9900ff20;
      border: 2px solid transparent;
      border-radius: 20px;
      color: white;
      font-size: 20px;

      ::placeholder {
        font-size: 15px;
        margin-left: 4px;
      }
    }
    svg {
      position: absolute;
      top: 1px;
      right: 1.4rem;
      color: white;

      @media screen and (max-width: 650px) {
        right: 1.9rem;
      }
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
    .no-contacts-container {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      img {
        height: 30vh;
      }
      h2 {
        color: white;
      }
      h3 {
        color: white;
      }
      div {
        background-color: #9a86f3;
        color: white;
        margin-top: 20px;
        padding: 1rem 3rem;
        border-radius: 15px;
        font-weight: 700;
      }
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
