import styled from "styled-components";

export const DivLayout = styled.div` {
  margin: 2px;
  border: 1px solid var(--light);
  border-radius: 5px;
  background-color: var(--dark-color-transparent);
  overflow:hidden;
  cursor: pointer;
}`;

export const SpanRemoveLayoutCell = styled.span` {
    position:absolute;
    padding: 3px 5px;
    right: 0;
    top: 0;
    cursor: pointer;
}`;

export const SpanEditLayoutCell = styled.span` {
    position:absolute;
    padding: 3px 5px;
    left: 0;
    top: 0;
    cursor: pointer;
}`;

