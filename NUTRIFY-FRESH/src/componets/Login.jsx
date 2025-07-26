import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import { UserContext } from "../contexts/UserContext";
export default function Login() {
  const loggedData = useContext(UserContext);

  const [userCredis, setUserCreds] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const [message, setMessage] = useState({
    type: "invisible-msg",
    text: "Dummy Msg",
  });

  function handleInput(event) {
    setUserCreds((prevState) => {
      return { ...prevState, [event.target.name]: event.target.value };
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    console.log(userCredis);

    fetch("http://localhost:8000/login", {
      method: "POST",
      body: JSON.stringify(userCredis),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        //console.log(response);

        if (response.status === 404) {
          setMessage({
            type: "error",
            text: "username or email Doesn't exist",
          });
        } else if (response.status === 403) {
          setMessage({ type: "error", text: "incorrect password" });
        }

        setTimeout(() => {
          setMessage({
            type: "invisible-msg",
            text: "Dummy Msg",
          });
        }, 5000);

        return response.json();
      })
      .then((data) => {
        console.log(data);

        if (data.token != undefined) {
          //* agr token aaya backned se tabhi ye navigate karge and localstorage mai store hoga;

          localStorage.setItem("nurtrify-user", JSON.stringify(data));

          loggedData.setLoggedUser(data);
          // setTimeout(() => {
          //   console.log("Updated user data:", loggedInData.loggedUser); // should now reflect the update
          // }, 0);   //* i use setTimeout for this because asynchronusly chalta hai ye

          navigate("/track");
        }
      })
      .catch((err) => {
        console.log(err);
      });
    setUserCreds({ email: "", password: "" });
  }

  return (
    
    <section className="container">
      <form className="form" onSubmit={handleSubmit}>
        <h1>Access Your Fitness Journey</h1>

        <input
          className="inp"
          type="email"
          required
          placeholder="Enter Email"
          name="email"
          onChange={handleInput}
          value={userCredis.email}
        />
        <input
          className="inp"
          type="password"
          required
          placeholder="Enter password "
          name="password"
          onChange={handleInput}
          value={userCredis.password}
        />

        <button className="btn">Login</button>

        <p>
          Don't have account ?<Link to="/registar">Registar Now</Link>
        </p>

        <p className={message.type}>{message.text}</p>
      </form>
    </section>
  );
}
