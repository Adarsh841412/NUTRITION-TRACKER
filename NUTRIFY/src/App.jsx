import { BrowserRouter, Routes, Route,useNavigate } from "react-router-dom";
import "./App.css";

import Register from "./componets/Register";
import Login from "./componets/Login";
import NotFound from "./componets/NotFound";
import { Track } from "./componets/Track";

import { UserContext } from "./contexts/UserContext";
import { useEffect, useState,useContext } from "react";
import Private from "./componets/Private";

import Diet from "./componets/diet";

function App() {


   const user = localStorage.getItem("nurtrify-user");
  
  const[loggedUser,setLoggedUser]=useState(JSON.parse(user));


  // useEffect(() => {
  //   // ✅ Only runs once on mount
   
  //   if (user) {
  //     setLoggedUser(JSON.parse(user)); // parse it back to object
    
  //   }
  
  // }, []);


useEffect(()=>{    //* here i check token or id stored or not in context
  console.log("conetext-obj",loggedUser)
})



  return (
    <>
<UserContext.Provider  value={{loggedUser,setLoggedUser}} >

 <BrowserRouter>
        <Routes>

          <Route path="/" element={<Register/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/registar" element={<Register/>}/>
          <Route path="/track" element={<Private component={Track}/>}/>
          <Route path="*" element={<NotFound/>}/>
          <Route path="/diet" element={<Private  component={Diet}/>}/>

        </Routes>
     
</BrowserRouter>
      </UserContext.Provider>
    </>
  );
}

export default App;
