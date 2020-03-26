import styled from "styled-components";

export const ScriptEditorGrid = styled.div` {
  display: grid;
  grid-template-columns: 47% 5% 45%;
  grid-template-rows: 2rem calc(100% - 2rem);
  grid-gap: 5px 1.5%;
  grid-template-areas: "scriptTitle  scriptControlsHeader outputTabs"
                       "script       scriptControls scriptOutput";
  padding-top: 3%;
  height: 100%;
}`;

export const ScriptTitle = styled.div` {
  grid-area: scriptTitle;
  display: block;
  place-self: center;
}`;

export const ScriptEditor = styled.div` {
  grid-area: script;
}`;

export const ScriptControlsHeader = styled.div` {
  grid-area: scriptControlsHeader;
  display: block;
}`;

export const ScriptEditorControls = styled.div` {
  grid-area: scriptControls;
  display: block;
  place-self: center;
  align-self: start;
}`;

export const ScriptOutputTabs = styled.div` {
  grid-area: outputTabs;
  display: flex;
  justify-content: space-between;
  align-self: center;
}`;

export const ScriptResultTabs = styled.div ` {
  
}`

export const ScriptOutput = styled.div` {
  grid-area: scriptOutput;
}`;

export const DivAutoMargin = styled.div` {
  margin: 20px auto;
}`;

