import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  AiOutlineUserAdd,
  AiOutlineSearch,
  AiOutlineHome,
  AiOutlineUsergroupAdd,
} from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo.svg";
import axios from "axios";
import { findUserRoute, friendRequestRoute } from "../utils/APIRoutes";
import { BiUserCheck } from "react-icons/bi";
import { toast, ToastContainer } from "react-toastify";
import LoadingLottie from "../assets/98432-loading.json";
import Lottie from "react-lottie-player";

const AddFriend = () => {
  const navigate = useNavigate();
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentUserId, setCurrentUserId] = useState(undefined);
  const [query, setQuery] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [friendRequestCounter, setFriendRequestCounter] = useState("");
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState([]);

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
    const getUserFriendRequests = async () => {
      setLoading(true);
      const user = await axios.get(
        `${findUserRoute}?username=${currentUserName?.toLowerCase()}`
      );
      user.data[0] &&
        setFriendRequestCounter(user.data[0].friendRequests.length);
      setLoading(false);
    };
    getUserFriendRequests();
  }, [currentUserName]);

  useEffect(() => {
    const getAddedUsers = async () => {
      const addedUsers = await axios.get(
        `${findUserRoute}?username=${currentUserName?.toLowerCase()}`
      );
      const allFriendsAdded = [];
      const friendRequests = [];
      const friendsList = [];
      const allFriendsUID = [];

      !loading &&
        addedUsers &&
        friendRequests.push(addedUsers.data[0].friendRequests);
      !loading && addedUsers && friendsList.push(addedUsers.data[0].friends);
      !loading &&
        addedUsers &&
        allFriendsAdded.push(friendRequests[0].concat(friendsList[0]));

      if (!loading && addedUsers) {
        for (let index = 0; index < allFriendsAdded[0].length; index++) {
          allFriendsUID.push(allFriendsAdded[0][index].UID);
        }
      }
      !loading && addedUsers && setAdded(allFriendsUID);
    };
    getAddedUsers();
  }, [currentUserName, loading]);

  useEffect(() => {
    const findQueryUsers = async () => {
      setLoading(true);
      await axios
        .get(`${findUserRoute}?username=${query?.toLowerCase()}`)
        .then((res) => setAllUsers(res.data));
      setLoading(false);
    };
    findQueryUsers();
  }, [query]);

  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const handleAddFriend = async (user) => {
    try {
      await axios.post(`${friendRequestRoute}`, {
        _id: user._id,
        UID: currentUserId,
        username: currentUserName,
        avatarImage: currentUserImage,
      });
      setAdded([...added, user._id]);
      toast.success("User has been successfully added", toastOptions);
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong..", toastOptions);
    }
  };

  const searchAdd = (id) => {
    if (added) {
      return added.map((add) => add === id);
    }
  };
  const searchFriendRequests = (user) => {
    const friendReq = user && user.friendRequests;
    const allFriendReq = [];
    const checkIfRight = [];
    if (friendReq) {
      friendReq.map((req) => {
        return allFriendReq.push(...allFriendReq, req.UID);
      });
    }
    if (allFriendReq) {
      allFriendReq.map((id) => {
        return checkIfRight.push(id === currentUserId);
      });
    }
    return checkIfRight;
  };

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
              className="nav-friends"
              onClick={() => navigate("/friend-requests")}
            >
              <AiOutlineUsergroupAdd />
            </button>
          </div>
          {friendRequestCounter !== 0 && (
            <div className="friend-request-counter">
              {friendRequestCounter && friendRequestCounter}
            </div>
          )}
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
            allUsers.map((user, index) => (
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
                <button
                  onClick={() => handleAddFriend(user)}
                  disabled={
                    added === user._id ||
                    currentUserId === user._id ||
                    searchFriendRequests(user).includes(true)
                  }
                  className={
                    searchAdd(user._id).includes(true) ||
                    currentUserId === user._id ||
                    searchFriendRequests(user).includes(true)
                      ? "added"
                      : ""
                  }
                >
                  {searchAdd(user._id).includes(true) ||
                  currentUserId === user._id ||
                  searchFriendRequests(user).includes(true) ? (
                    <BiUserCheck />
                  ) : (
                    <AiOutlineUserAdd />
                  )}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
      <ToastContainer />
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
      .friend-request-counter {
        border-radius: 50%;
        background-color: red;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
        top: 0.6rem;
        right: 0.7rem;
        position: absolute;
        color: white;
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
          padding-left: 1rem;
          @media screen and (max-width: 650px) {
            flex-direction: column;
          }
          .avatar {
            img {
              height: 3rem;
              padding-right: 10px;
              @media screen and (max-width: 650px) {
                padding-bottom: 5px;
                padding-right: 0px;
              }
            }
          }
          .username {
            h3 {
              color: white;
              @media screen and (max-width: 650px) {
                font-size: 15px;
              }
            }
          }
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
          position: absolute;
          top: 1rem;
          right: 1rem;
          svg {
            color: white;
            font-size: 20px;
          }
        }
        .added {
          background-color: green;
          opacity: 0.5;
          cursor: not-allowed;
        }
      }
    }
  }
`;

export default AddFriend;
