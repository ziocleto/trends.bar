import styled from "styled-components";

const TextButton = styled.div` {
  border-radius: 5px;
  border: 1px solid var(--warning);
  padding: 5px;
  background-color: var(--dark);
    
  &:hover {
    border: 1px solid darkgray;
    background-color: var(--primary);
  }
  
  &:active {
    background-color: var(--dark-color-transparent);
  }
  cursor:pointer;
}`;

export const Overtitle = styled.div` {
  font-size: 1.3rem;
  color: var(--logo-color-2);
}`;

export const OvertitleButton = styled(TextButton)` {
  font-size: 1.3rem;
  color: var(--logo-color-2);
}`;

export const Title = styled.div` {
    font-size: 2.2rem;
    font-weight: bold;
    color: var(--secondary-alt-color);
}`;

export const TitleButton = styled(TextButton)` {
    font-size: 2.2rem;
    font-weight: bold;
    color: var(--secondary-alt-color);
}`;

export const Subtitle = styled.div` {
    font-size: 1.15rem;
    font-weight: bold;
}`;

export const SubtitleButton = styled(TextButton)` {
    font-size: 1.15rem;
    font-weight: bold;
}`;
