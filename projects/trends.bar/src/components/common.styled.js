import styled from "styled-components";

export const TrendLayout = styled.div` {
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: calc(100% - var(--navbar-height));
  z-index: 0;
  margin: calc(var(--navbar-height) + var(--mainMargin)) var(--mainMargin) var(--mainMargin) var(--mainMargin);
}`;

export const TrendGrid = styled.div` {
  height: 100vh;
  width: calc(100% - (var(--mainMargin) * 2));
}`;
