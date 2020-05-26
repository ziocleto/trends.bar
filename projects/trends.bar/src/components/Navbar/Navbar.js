import React, {Fragment} from "react";
import {ProgressBar} from "../../futuremodules/progressbar/ProgressBar";
import {NavbarTitle} from "./Navbar.styled";
import {NavbarComponent} from "../../futuremodules/reactComponentStyles/reactCommon.styled";
import {NavbarUser} from "../../futuremodules/navbar/components/NavbarUser";
import {NavbarLogoAndTitle} from "./NavbarLogoAndTitle";
import {NavbarLeftHandSizeComponent} from "../../futuremodules/navbar/components/navbar-styled";
import {useGetNavbarTitle} from "./NavbarLogic";

export const Navbar = () => {

  const getNavbarTitle = useGetNavbarTitle();

  return (
    <Fragment>
      <ProgressBar/>
      <NavbarComponent>
        <NavbarLeftHandSizeComponent>
        <NavbarLogoAndTitle/>
        </NavbarLeftHandSizeComponent>
        <NavbarTitle>{getNavbarTitle()}</NavbarTitle>
        <NavbarUser/>
      </NavbarComponent>
    </Fragment>
  );
};
