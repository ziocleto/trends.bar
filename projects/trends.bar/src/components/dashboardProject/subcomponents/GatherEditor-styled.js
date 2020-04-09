import styled from "styled-components";

export const ScriptEditorGrid = styled.div` {
  margin-top: 20px;
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
  width: 100%;
  border-radius: 3px;
  padding: 10px;
  border: 1px solid var(--gray);
  margin-top: 10px;
}`;

export const ScriptGraphContainer = styled.div `{
  min-height: 500px;
}`;

export const GroupTransform = styled.div` {
  display: flex;
  width: 100%;
  justify-content: space-between;
}`;

