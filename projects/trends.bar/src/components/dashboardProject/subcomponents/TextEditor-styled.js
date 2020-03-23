import styled from "styled-components";

export const ScriptEditorGrid = styled.div` {
  display: grid;
  grid-template-columns: 47% 5% 45%;
  grid-template-rows: 2rem calc(100% - 2rem);
  grid-gap: 0% 1.5%;
  grid-template-areas: "scriptTitle  scriptControls outputTabs"
                       "script       scriptControls scriptOutput";
  padding: 1%;
}`;

export const ScriptTitle = styled.div` {
  grid-area: scriptTitle;
  display: block;
  place-self: center;
}`;

export const ScriptEditorControls = styled.div` {
  grid-area: scriptControls;
  display: block;
  place-self: center;
}`;

export const ScriptOutputTabs = styled.div` {
  grid-area: outputTabs;
  display: block;
  place-self: start;
}`;

export const DivAutoMargin = styled.div` {
  margin: 20px auto;
}`;
