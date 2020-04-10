import React, {Fragment} from "react";
import {useLocation} from "react-router-dom";
import {ProgressBar} from "../../futuremodules/progressbar/ProgressBar";
import {NavbarTitle} from "./Navbar.styled";
import {
  getFileNameOnlyNoExt,
  isReservedWordSanitized,
  sanitizeAvoidReservedWords
} from "../../futuremodules/utils/utils";
import {NavbarComponent} from "../../futuremodules/reactComponentStyles/reactCommon.styled";
import NavbarUser from "../../futuremodules/navbar/components/NavbarUser";
import {NavbarLogoAndTitle} from "./NavbarLogoAndTitle";
import {NavbarLeftHandSizeComponent} from "../../futuremodules/navbar/components/navbar-styled";

const Navbar = (props) => {

  const isLocationReserved = isReservedWordSanitized(useLocation().pathname);
  const propTrendId = !isLocationReserved && getFileNameOnlyNoExt(sanitizeAvoidReservedWords(props.trendId));

  return (
    <Fragment>
      <ProgressBar/>
      <NavbarComponent>
        <NavbarLeftHandSizeComponent>
        <NavbarLogoAndTitle/>
        </NavbarLeftHandSizeComponent>
        <NavbarTitle>{propTrendId}</NavbarTitle>
        <NavbarUser/>
      </NavbarComponent>
    </Fragment>
  );
};

export default Navbar;
