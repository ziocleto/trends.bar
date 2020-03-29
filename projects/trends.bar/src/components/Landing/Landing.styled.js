import styled from 'styled-components'

export const LandingSection = styled.section` {
  position: relative;
  height: 100vh;
}`;

export const LandingInner = styled.div` {
  height: 100%;
  width: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  font-size: 3rem;
  font-family: Aileron-Thin,serif;
  font-weight: lighter;
  margin: calc(var(--navbar-height) + 3rem) auto;
}`;

export const LandingSearchBar = styled.div` {
  width: 50%;
  overflow: hidden;
}`;

export const SearchBarResultContainer = styled.div` {
  display: flex;
  width: 50%;
  height: 3rem;
  overflow: hidden;
  font-size: var(--font-size-big);
  background: var(--happy-color-trasparent);
  border-radius: 5px;
  border: 1px solid var(--logo-color-1);
  margin-top: 10px;  
  align-items: center;
  text-align: center;
  justify-content: space-between;
  cursor: pointer;
  padding: 0px 10px;
}`;

export const SearchBarResultTrendId = styled.div` {
  color: var(--secondary-alt-color)
}`;

export const SearchBarResultUser = styled.div` {
  color: var(--logo-color-2);
  font-size: var(--font-size-one);
}`;
