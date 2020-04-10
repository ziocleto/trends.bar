import {Navbareh, NavbarLogo, NavbarLogoAndTitleContainer} from "./Navbar.styled";
import {Link} from "react-router-dom";
import {Logo1TextSpan, Logo2TextSpan} from "../../futuremodules/reactComponentStyles/reactCommon.styled";
import React from "react";

export const NavbarLogoAndTitle = () => {
  return (
      <NavbarLogoAndTitleContainer>
        <NavbarLogo>
          <Link to={"/"}>
            <img src="/ehlogo.svg" alt=""/>
          </Link>
        </NavbarLogo>
        <Navbareh>
          <Link to={"/"}>
            <Logo1TextSpan>T</Logo1TextSpan>
            <span>rends</span> <Logo2TextSpan>B</Logo2TextSpan>
            <span>ar</span>
          </Link>
        </Navbareh>
      </NavbarLogoAndTitleContainer>
  )
};
