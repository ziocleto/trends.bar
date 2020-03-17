import styled from 'styled-components'

export const H1 = styled.h1` {
    color: var(--scheme-color-3)
  }`;

export const H2 = styled.h2` {
    color: var(--scheme-color-3)
  }`;

export const H3 = styled.h3` {
    color: var(--scheme-color-3)
  }`;

export const H4 = styled.h4` {
    color: var(--scheme-color-3)
  }`;

export const H5 = styled.h5` {
    color: var(--scheme-color-3)
  }`;

export const H6 = styled.h6` {
    color: var(--scheme-color-3)
  }`;

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

export const TrendGraph = styled.div` {
    width: 100%;
    padding-top: 30px;
  }`;

export const FlexContainer = styled.div` {
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;    
    align-content: flex-start;
    align-items: flex-start;
    font-size: medium;
    width: 100%;
    box-sizing: border-box;
    padding: 20px;
  }`;
