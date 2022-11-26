import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Robot from "../assets/robot.gif";
import { useNavigate } from "react-router-dom";
import Logout from "./Logout";
export default function Welcome() {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const getUsername = async () => {
      setUserName(
        await JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        ).username
      );
    };
    getUsername();
  }, []);

  return (
    <Container>
      <div className="img-welcome">
        <img src={Robot} alt="" />
        <div className="logout-welcome">
          <Logout />
        </div>
      </div>
      <h1>
        Welcome, <span>{userName}!</span>
      </h1>
      <h3>Please select a chat to Start messaging.</h3>
      <br />
      <br />
      <h2>Don't have any contacts?</h2>
      <br />
      <div className="contacts" onClick={() => navigate("/add-friend")}>
        <h1>Click me!</h1>
      </div>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  flex-direction: column;
  position: relative;
  @media screen and (max-width: 600px) {
    display: none;
  }
  .img-welcome {
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      height: 20rem;
    }
  }
  .logout-welcome {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }
  span {
    color: #4e0eff;
  }
  .contacts {
    background-color: #4e0eff;
    padding: 10px;
    width: 15rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 30px;
    margin-bottom: 10px;
    cursor: pointer;

    h1 {
      padding-top: 6px;
    }
  }
`;
