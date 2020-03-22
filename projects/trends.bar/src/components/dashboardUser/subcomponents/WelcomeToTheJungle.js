import React from "reactn";
import {getUserName} from "../../../futuremodules/auth/authAccessors";

export const WelcomeToTheJungle = ({auth}) => {

  const name = getUserName(auth);

  return (
    <div className="large">
      <span>Hello, </span>{" "}
      <span className="navdiv-projecttext">
          {name}
      </span>
    </div>
  )
}
