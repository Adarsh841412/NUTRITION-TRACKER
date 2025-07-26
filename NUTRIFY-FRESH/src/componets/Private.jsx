import { Navigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { useContext } from "react";

export default function Private(props) {
  const loggedData = useContext(UserContext);
  const Component = props.component;

  return loggedData.loggedUser ? <Component /> : <Navigate to="/login" />;
}
