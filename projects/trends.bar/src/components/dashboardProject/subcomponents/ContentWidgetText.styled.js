import styled from "styled-components";

export const Container = styled.div` {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    align-content: center;
    height: 100%;
    overflow:scroll;
}`;

export const Overtitle = styled.div` {
    font-size: 1.3rem;
    color: var(--primary-color-light);
}`;

export const Title = styled.div` {
    font-size: 2.2rem;
    font-weight: bold;
    color: var(--secondary-alt-color);
}`;

export const Subtitle = styled.div` {
    font-size: 1.15rem;
    font-weight: bold;
}`;

