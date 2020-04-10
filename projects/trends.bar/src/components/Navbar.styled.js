import styled from 'styled-components'

export const UserNameText = styled.div` {
  grid-area: navbaruser;
  align-self: center;
  justify-self: end;
  color: var(--primary-color);
  cursor: pointer;
}`;

export const NavbarGrid = styled.div` {
  display: grid;
  grid-template-columns: 2% 23% 50% 25%;
  grid-template-rows: 100%;
  grid-template-areas: "navbarlogo navbareh navbartitle navbaruser";
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
