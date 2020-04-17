import styled from "styled-components";

export const DivLayout = styled.div` {
  border: 1px solid var(--light);
  border-radius: 5px;
  background-color: var(--dark-color-transparent);
  overflow:hidden;
  cursor: move;
}`;

export const DivLayoutStatic = styled.div` {
  border: 1px solid var(--light);
  border-radius: 5px;
  background-color: var(--dark-color-transparent);
  overflow:scroll;
}`;

export const SpanRemoveLayoutCell = styled.span` {
    position:absolute;
    padding: 4px 7px;
    right: 0;
    top: 0;
    cursor: pointer;
}`;

export const SpanEditLayoutCell = styled.span` {
    position:absolute;
    padding: 4px 7px;
    left: 0;
    top: 0;
    cursor: pointer;
}`;

export const ContentWidgetMenuBar = styled.div` {
    position:absolute;
    left: 0;
    top: 0;
    width: 100%;
    font-size: var(--font-size-one);
    height: 4rem;
    background-color: var(--primary);
}`;

