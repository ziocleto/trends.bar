import styled from "styled-components";

export const DivLayout = styled.div` {
  //margin: 2px;
  border: 1px solid var(--light);
  border-radius: 5px;
  background-color: var(--dark-color-transparent);
  overflow:hidden;
  cursor: move;
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

export const ContentWidgetMenuBar = styled.div` {
    position:absolute;
    left: 0;
    top: 0;
    width: 100%;
    font-size: var(--font-size-one);
    height: calc( var(--font-size-one) * 2 );
    background-color: var(--primary);
}`;
