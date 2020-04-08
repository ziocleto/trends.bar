import styled from "styled-components";

export const ScriptEditorGrid = styled.div` {
  --gridGrapX: 10px;
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 3em 6em 10em;
  grid-gap: 2px var(--gridGrapX);
  grid-template-areas: "scriptTitle     "
                       "scriptVariables "
                       "script          ";
  //height: calc(100vh - var(--navbar-height) - 150px);
  margin-top: 5px;
}`;

export const ScriptVariables = styled.div` {
  grid-area: scriptVariables;
  height: 6em;
}`;

export const ScriptTitle = styled.div` {
  grid-area: scriptTitle;
  display: flex;
  justify-content: space-between;
  align-self: center;
  background: #263238;
  height: 100%;
  padding: 6px;
  border-radius: 3px;
  border: 1px solid var(--gray);
}`;

export const FileManagementElement = styled.div` {
  display: flex;
  align-self: center;
}`;

export const FileManagementDxMargin = styled.div` {
  margin-right: 0.15em;
}`;

export const FileManagementSxMargin = styled.div` {
  margin-left: 0.15em;
  padding-left: 0.15em;
}`;

export const FileManagementSxPadding = styled.div` {
  padding-left: 8px;
}`;

export const ScriptFileName = styled.div` {
  align-self: center;
  border: 1px solid var(--light-color);
  border-radius: 3px;
  background-color: var(--primary);
  padding: 0.33em;
}`;

export const ScriptEditorContainer = styled.div` {
  grid-area: script;
}`;

export const ScriptOutputTabs = styled.div` {
  grid-area: outputTabs;
  display: flex;
  justify-content: space-between;
  align-self: center;
}`;

export const ScriptResultTabs = styled.div` {
  
}`;

export const ScriptOutput = styled.div` {
  grid-area: scriptOutput;
}`;

export const InfoColor = styled.span`{
  color: var(--info)
}`;

export const DangerColor = styled.span`{
  color: var(--danger);
}`;

const dangerButton = `
  color: var(--danger-color);
  align-self: center;
  cursor: pointer;
  
  :hover {
    color: var(--white);
  }
  
  :active {
    color: var(--middle-grey-color);
  }
`;

export const DangerColorSpan = styled.span`{
  ${dangerButton}
}`;

export const DangerColorDiv = styled.div`{
  ${dangerButton}
}`;

export const DangerColorTd = styled.td`{
  ${dangerButton}
}`;

export const PrimaryColor = styled.span`{
  color: var(--primary)
}`;

export const FormGroupBorder = styled.div` {
  display: flex;
  flex-direction: column;
  border-radius: 3px;
  padding: 10px;
  border: 1px solid var(--gray);
  margin-top: 10px;
}`;

export const GroupTransform = styled.div` {
  display: flex;
  width: 100%;
  justify-content: space-between;
}`;

