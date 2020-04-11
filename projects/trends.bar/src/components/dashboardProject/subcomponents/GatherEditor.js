import React from "reactn";
import {ScriptEditorGrid} from "./GatherEditor-styled";
import "./GatherEditor.css"
import {ScriptEditor} from "./ScriptEditor";

export const ScriptCodeEditor = () => {
  return (
    <ScriptEditorGrid>
        <ScriptEditor/>
    </ScriptEditorGrid>
  );
};

