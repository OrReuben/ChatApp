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
      <div style={{width:"90%", height:"20%", display:"flex",alignItems:"flex-end", justifyContent:"flex-end"}}>
      <Logout />
      </div>
      <img src={Robot} alt=""  />
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

  @media screen and (max-width: 600px) {
    display: none;
  }
  img {
    height: 17rem;
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
