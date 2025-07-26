import { useState } from "react";
import Login from "./Login";
import { Link } from "react-router-dom";

export default function Register() {
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
  });

  let [message, setMessage] = useState({
    type: "invisible-msg", //*  i set default value here
    text: "Dummy msg",
  });
  function handleInput(event) {
    // console.log(event.target.name);  //* it will give the name
    // console.log(event.target.value);  //* it will give name value

    setUserDetails((prevState) => {
      return { ...prevState, [event.target.name]: event.target.value };
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    console.log(userDetails);

    fetch("http://localhost:8000/register", {
      method: "POST",
      body: JSON.stringify(userDetails),
      headers: {
        "content-Type": "application/json",
      },
    })
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((data) => {
        console.log(data);

        setMessage({ type: "success", text: data.message });

        setTimeout(() => {
          setMessage({ type: "invisible-msg", text: data.message });
        }, 5000);
      })
      .catch((err) => {
        console.log(err);
      });

    setUserDetails({ name: "", email: "", age: "", password: "" });
  }

  return (
    <section className="container">
      <form className="form" onSubmit={handleSubmit}>
        <h1>Start you Fitness</h1>

        <input
          className="inp"
          type="text"
          placeholder="Enter Name"
          name="name"
          required
          onChange={handleInput}
          value={userDetails.name}
        />
        <input
          className="inp"
          type="email"
          placeholder="Enter Email"
          name="email"
          required
          onChange={handleInput}
          value={userDetails.email}
        />
        <input
          className="inp"
          type="password"
          placeholder="Enter password "
          name="password"
          maxLength={8}
          required
          onChange={handleInput}
          value={userDetails.password}
        />
        <input
          className="inp"
          type="number"
          max={100}
          min={10}
          required
          placeholder="Enter your age"
          name="age"
          onChange={handleInput}
          value={userDetails.age}
        />

        <button className="btn" onSubmit={handleSubmit}>
          Join
        </button>

        <p>
          Already Registered ? <Link to="/login">Login </Link>
        </p>

        <p className={message.type}>{message.text}</p>
      </form>
    </section>
  );
}
