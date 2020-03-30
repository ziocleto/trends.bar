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

export const TH = styled.th` {
    cursor: pointer;
}`;

export const TR = styled.tr` {
    cursor: pointer;
}`;

export const TrendSpan = styled.span `{
  color: var(--primary);
  font-weight: bold;
}`;

export const LinkBack = styled.span `{
  color: var(--info);
  font-weight: bold;
}`;

export const TDGREEN = styled.td `{
  background-color: var(--success-color);
}`;

export const TDRED = styled.td `{
  background-color: var(--danger-color);
}`;

export const TDAMBER = styled.td `{
  background-color: var(--warning);
}`;
