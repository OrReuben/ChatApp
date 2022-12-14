import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { AiOutlineSearch, AiOutlineRight, AiOutlineHome } from "react-icons/ai";
import { FiUserCheck, FiUserX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo.svg";
import axios from "axios";
import {
  confirmFriendRequestRoute,
  declineFriendRequestRoute,
  findUserRoute,
} from "../utils/APIRoutes";
import LoadingLottie from "../assets/98432-loading.json";
import Lottie from "react-lottie-player";

const FriendRequest = () => {
  const navigate = useNavigate();
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentUserId, setCurrentUserId] = useState(undefined);
  const [query, setQuery] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    const setUserInfo = async () => {
      setLoading(true);
      const data = await JSON.parse(
        localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
      );
      setCurrentUserName(data.username);
      setCurrentUserImage(data.avatarImage);
      setCurrentUserId(data._id);
      setLoading(false);
    };
    setUserInfo();
  }, []);

  useEffect(() => {
    const findQueryUsers = async () => {
      setLoading(true);
      const users = await axios.get(
        `${findUserRoute}?username=${currentUserName?.toLowerCase()}`
      );
      users.data[0] && setAllUsers(users.data[0].friendRequests);
      setLoading(false);
    };
    findQueryUsers();
  }, [currentUserName]);

  useEffect(() => {
    const Search = () => {
      if (allUsers) {
        return allUsers.filter((user) =>
          user.username.toLowerCase().includes(query)
        );
      }
    };
    setFilteredUsers(Search());
  }, [query, allUsers]);

  const handleConfirmFriend = async (user) => {
    try {
      await axios.post(`${confirmFriendRequestRoute}`, {
        currentUserUsername: currentUserName,
        currentUserId: currentUserId,
        currentUserAvatarImage: currentUserImage,
        requestedUserId: user.UID,
        requestedUserUsername: user.username,
        requestedUserAvatarImage: user.avatarImage,
      });
      window.location.reload();
    } catch {}
  };
  const handleDeclineFriend = async (user) => {
    try {
      await axios.post(`${declineFriendRequestRoute}`, {
        _id: currentUserId,
        UID: user.UID,
      });
      window.location.reload();
    } catch {}
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Container>
      <div className="container">
        <div className="brand">
          <div className="current-user">
            <div className="avatar">
              <img
                src={`data:image/svg+xml;base64,${
                  currentUserImage ? currentUserImage : ""
                }`}
                alt="avatar"
              />
            </div>
            <div className="username">
              <h2>{currentUserName}</h2>
            </div>
          </div>
          <div className="logo" onClick={() => navigate("/")}>
            <img src={Logo} alt="logo" />
            <h3>chatib</h3>
          </div>
          <div className="nav-options">
            <button className="nav-home" onClick={() => navigate("/")}>
              <AiOutlineHome />
            </button>
            <button
              className="nav-back"
              onClick={() => navigate("/add-friend")}
            >
              <AiOutlineRight />
            </button>
          </div>
        </div>
        <div className="search-container">
          <AiOutlineSearch />
          <input
            placeholder="Search for users.."
            type="text"
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="all-users-container">
          {loading ? (
            <Lottie
              loop
              animationData={LoadingLottie}
              play
              style={{ width: 300, height: 500 }}
            />
          ) : (
            filteredUsers.map((user) => (
              <div key={user._id} className="user">
                <div className="user-credentials">
                  <div className="avatar">
                    <img
                      src={`data:image/svg+xml;base64,${user?.avatarImage}`}
                      alt=""
                    />
                  </div>
                  <div className="username">
                    <h3>{user.username}</h3>
                  </div>
                </div>
                <div className="user-actions">
                  <button
                    className="confirm-button"
                    onClick={() => handleConfirmFriend(user)}
                  >
                    <FiUserCheck />
                  </button>
                  <button
                    className="decline-button"
                    onClick={() => handleDeclineFriend(user)}
                  >
                    <FiUserX />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Container>
  );
};

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;

  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-rows: 12% 10% 78%;
    @media screen and (max-width: 600px) {
      height: 95vh;
      width: 95vw;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 1rem;
      justify-content: center;
      position: relative;
      .current-user {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1rem;
        position: absolute;
        left: 2vw;
        top: 2vh;
        .avatar {
          img {
            height: 2.5rem;
            max-inline-size: 100%;
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
      .nav-options {
        position: absolute;
        top: 1rem;
        right: 1rem;
        display: flex;
        button {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0.6rem;
          border-radius: 0.5rem;
          background-color: #9a86f3;
          border: none;
          cursor: pointer;
          font-size: 20px;
          color: white;
        }
        .nav-home {
          margin-right: 10px;
        }
      }
      .logo {
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
        @media screen and (max-width: 650px) {
          display: none;
        }
        img {
          height: 2rem;
          padding-right: 0.5rem;
        }
        h3 {
          color: white;
          text-transform: uppercase;
          padding-left: 0.5rem;
        }
      }
    }

    .search-container {
      display: flex;
      align-content: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      position: relative;
      input {
        width: 90%;
        height: 95%;
        border: 2px solid transparent;
        border-radius: 20px;
        font-size: 30px;
        background-color: #9900ff20;
        color: white;

        @media screen and (max-width: 650px) {
          font-size: 20px;
        }
      }
      svg {
        position: absolute;
        font-size: 35px;
        top: 0.5rem;
        right: 4rem;
        color: white;
        @media screen and (max-width: 650px) {
          font-size: 25px;
          top: 0.75rem;
          right: 2rem;
        }
      }
    }
    .all-users-container {
      display: flex;
      align-items: center;
      width: 100%;
      height: 100%;
      flex-direction: column;
      overflow-y: scroll;
      gap: 1rem;
      &::-webkit-scrollbar {
        width: 0.2rem;
        &-thumb {
          background-color: #9a86f3;
          width: 0.1rem;
          border-radius: 1rem;
        }
      }
      .user {
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
        position: relative;

        &:first-child {
          margin-top: 3vh;
        }
        &:last-child {
          margin-bottom: 3vh;
        }
        .user-credentials {
          display: flex;
          align-items: center;
          justify-content: center;
          padding-left: 2rem;

          @media screen and (max-width: 650px) {
            flex-direction: column;
            padding-left: 1rem;
          }
          .avatar {
            img {
              height: 3rem;
              padding-right: 0.9rem;
              @media screen and (max-width: 650px) {
                padding-right: 0rem;
                padding-bottom: 10px;
              }
            }
          }
          .username {
            h3 {
              color: white;
              @media screen and (max-width: 650px) {
                font-size: 10px;
              }
            }
          }
        }
        .user-actions {
          position: absolute;
          top: 1rem;
          right: 1rem;
          display: flex;
          @media screen and (max-width: 650px) {
            flex-direction: column;
            top: 0.5rem;
            right: 0.5rem;
          }
          button {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 1rem;
            border-radius: 0.5rem;
            background-color: #9a86f3;
            border: none;
            cursor: pointer;
            @media screen and (max-width: 650px) {
              padding: 0.5rem;
            }
            svg {
              color: white;
              font-size: 20px;
              @media screen and (max-width: 650px) {
                font-size: 15px;
              }
            }
          }
          .decline-button {
            background-color: red;
            margin-left: 10px;
            @media screen and (max-width: 650px) {
              margin-left: 0px;
              margin-top: 5px;
            }
          }
        }
      }
    }
  }
`;

export default FriendRequest;
