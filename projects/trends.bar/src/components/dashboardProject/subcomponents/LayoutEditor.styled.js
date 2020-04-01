import styled from "styled-components";

export const DivLayout = styled.div` {
  margin: 5px;
  border: 1px solid var(--light);
  background-color: var(--secondary-alt-color);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-content: center; 
  overflow:hidden;
}`;

export const ButtonBar = styled.div` {
    margin: 5px;
    padding: 5px;
    border-top: 1px solid var(--light);
    border-bottom: 1px solid var(--light);
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

