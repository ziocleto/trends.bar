import styled from 'styled-components'
import {navbarJustifyEndsWidth} from "../../futuremodules/navbar/components/navbar-styled";

export const NavbarLogoAndTitleContainer = styled.div` {
  display: grid;
  grid-template-columns: var(--navbar-logo-size) 100px;
  grid-template-areas: "logo    logotext";
  justify-items: start;
  align-items: center;
  width: ${navbarJustifyEndsWidth};
}`;

export const NavbarLogo = styled.div` {
  grid-area: logo;
  width:var(--navbar-logo-size);
  height:var(--navbar-logo-size);
  justify-self: start;
}`;

export const Navbareh = styled.div` {
  grid-area: logotext;
  align-self: center;
  justify-self: start;
  font-size: 1.3rem;
  padding-left: 3%;
}`;

export const NavbarTitle = styled.div `{
  grid-area: navbartitle;
  align-self: center;
  justify-self: center;
  font-size: 1.3rem;
  color: var(--secondary-alt-color);
}`;
