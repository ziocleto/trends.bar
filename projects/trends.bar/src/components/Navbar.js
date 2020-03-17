import React, {Fragment} from "react";
import {useGlobal} from "reactn";
import {Link} from "react-router-dom";
import {ProgressBar} from "../futuremodules/progressbar/ProgressBar";
import {Navbareh, NavbarGrid, NavbarLogo, NavbarTitle, UserNameText} from "./Navbar.styled";
import {getUserName, logoffFromProject, useGetAuth} from "../futuremodules/auth/authAccessors";
import {sanitizeAvoidReservedWords} from "../futuremodules/utils/utils";

const Navbar = (props) => {

  const [, setTrend] = useGlobal('trendId');
  const auth = useGetAuth();
  const userName = getUserName(auth);

  return (
    <Fragment>
      <ProgressBar/>
      <NavbarGrid>
        <NavbarLogo onClick={() => {
          setTrend(null).then();
        }}>
          <Link to={"/"}>
            <img src="/ehlogo.svg" alt=""/>
          </Link>
        </NavbarLogo>
        <Navbareh onClick={() => {
          setTrend(null).then();
        }}>
          <Link to={"/"}>
            {" "}
            <span className="colorLogo1">T</span>
            <span>rends</span> <span className="colorLogo2">B</span>
            <span>ar</span>
          </Link>
        </Navbareh>
        <NavbarTitle>{sanitizeAvoidReservedWords(props.trendId)}</NavbarTitle>
        <UserNameText onClick={() => logoffFromProject(auth) }>
          {userName && <span><i className="fas fa-user"/>{" "}{userName}</span>}
        </UserNameText>
      </NavbarGrid>
    </Fragment>
  );
};

export default Navbar;
