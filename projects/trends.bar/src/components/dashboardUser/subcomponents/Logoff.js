import {api} from "../../../futuremodules/api/apiEntryPoint";
import {DashboardUserInnerMargins} from "../DashboardUser.styled";
import {logoutUser} from "../../../futuremodules/auth/authApiCalls";
import React from "reactn";
import {useAuth} from "../../../futuremodules/auth/authAccessors";
import {Button} from "react-bootstrap";

export const Logoff = () => {

  const auth = useAuth();

  return (
    <div>
      <DashboardUserInnerMargins>
        <i className="fas fa-sign-out-alt"> </i> Great Scott, get me out of here
      </DashboardUserInnerMargins>
      <Button variant={"danger"}
        onClick={() => api(auth, logoutUser)}
      >Logout</Button>
    </div>
  )
};

