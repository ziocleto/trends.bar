import styled from "styled-components";

export const TrendLayout = styled.div ` {
  position: absolute;
  top: 0;
  left: 0;
  margin-top: var(--navbar-height);
  width: 100%;
  height: calc(100% - var(--navbar-height));
  z-index: 0;
}`;

export const TrendGrid = styled.div` {
    box-sizing: border-box;
    margin: 10px;
  }`;
