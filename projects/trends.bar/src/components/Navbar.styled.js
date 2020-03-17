import styled from 'styled-components'

export const UserNameText = styled.div` {
  grid-area: navbaruser;
  align-self: center;
  justify-self: end;
  color: var(--primary-color);
  cursor: pointer;
}`;

export const NavbarGrid = styled.div` {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 50000;
  height: var(--navbar-height);
  background: var(--dark-color-transparent);
  background-color: var(--dark-color-transparent);
  display: grid;
  grid-template-columns: 2% 23% 50% 25%;
  grid-template-rows: 100%;
  grid-template-areas: "navbarlogo navbareh navbartitle navbaruser";
  padding: 0.25% 1%;
  border-bottom: 1px solid var(--middle-grey-color);
}`;

export const NavbarLogo = styled.div` {
  grid-area: navbarlogo;
  align-self: center;
  justify-self: center;
}`;

export const Navbareh = styled.div` {
  grid-area: navbareh;
  align-self: center;
  justify-self: start;
  font-size: 1.3rem;
  padding-left: 1.5%;
}`;

export const NavbarTitle = styled.div `{
  grid-area: navbartitle;
  align-self: center;
  justify-self: center;
  font-size: 1.3rem;
  color: var(--secondary-alt-color);
}`;
