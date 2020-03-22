import {api} from "../../../futuremodules/api/apiEntryPoint";
import {DashboardUserInnerMargins} from "../DashboardUser.styled";
import {logoutUser} from "../../../futuremodules/auth/authApiCalls";
import React from "reactn";

export const Logoff = ({auth}) => {

  return (<div>
    <DashboardUserInnerMargins>
      <i className="fas fa-sign-out-alt"> </i> Great Scott, get me out of here
    </DashboardUserInnerMargins>
    <input
      type="button"
      className="btn btn-danger"
      value="Logout"
      onClick={() => api(auth, logoutUser)}
    />
  </div>)
};
