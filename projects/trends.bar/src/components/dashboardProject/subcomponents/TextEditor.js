import React, {Fragment, useState} from "react";
import {Controlled as CodeMirror} from "react-codemirror2";
import Button from "react-bootstrap/Button";
import {
  DivAutoMargin, ScriptControlsHeader,
  ScriptEditor,
  ScriptEditorControls,
  ScriptEditorGrid,
  ScriptOutput,
  ScriptOutputTabs,
  ScriptTitle
} from "./TextEditor-styled";
import {useMutation, useQuery} from "@apollo/react-hooks";
import {SAVE_SCRIPT, UPSERT_TREND_GRAPH} from "../../../modules/trends/mutations";
import {getScript} from "../../../modules/trends/queries";
import "./TextEditor.css"
import {Tab, Tabs} from "react-bootstrap";

require("codemirror/lib/codemirror.css");
require("codemirror/theme/material.css");
require("codemirror/theme/neat.css");
require("codemirror/mode/javascript/javascript.js");

const KeyResponseParsed = 'parsed';
const KeyResponseElaborated = 'elaborated';
const KeyResponseError = 'error';

export const ScriptCodeEditor = ({trendId, username}) => {
  const [fileJson, setFileJson] = useState({});
  const [key, setKey] = useState(KeyResponseElaborated);
  const [fileC, setFileC] = useState(null);

  const {data, loading} = useQuery(getScript(), {variables: {trendId, username}});
  const [saveScript] = useMutation(SAVE_SCRIPT);
  const [upserTrendGraph, response] = useMutation(UPSERT_TREND_GRAPH);

  if (loading === true) {
    return <Fragment/>
  }

  const injectScript = () => {
    let fileJsonInjected = fileJson;
    fileJsonInjected.trendId = trendId;
    fileJsonInjected.username = username;
    return fileJsonInjected;
  }

  let hasScriptErrors = false;
  if ( (response.data && response.loading === false) ) {
    if ( response.error || response.data.upsertTrendGraph.error ) {
      hasScriptErrors = true;
      if ( key !== KeyResponseError ) setKey(KeyResponseError);
    } else {
      if ( key === KeyResponseError ) setKey(KeyResponseElaborated);
    }
  }

  const getResponseTab = () => {
    if ( !response.data ) {
      return "";
    }
    if ( key === KeyResponseParsed ) {
      return response.data.upsertTrendGraph.crawledText;
    }
    if ( key === KeyResponseElaborated ) {
      return response.data.upsertTrendGraph.elaborationTraces;
    }
    if ( key === KeyResponseError ) {
      if ( response.data.upsertTrendGraph.error ) return response.data.upsertTrendGraph.error;
      return response.error;
    }
  };

  return (
    <ScriptEditorGrid>
      <ScriptTitle>
        <Tabs variant="pills" defaultActiveKey="home" id="input-script-tab">
          <Tab eventKey="home" title="Input Script">
          </Tab>
        </Tabs>
      </ScriptTitle>
      <ScriptEditor>
        <CodeMirror
          value={fileC}
          options={{
            mode: "javascript",
            theme: "material",
            // lineNumbers: true
          }}
          editorDidMount={() => setFileC(data.script.text)}
          onBeforeChange={(editor, data, value) => {
            setFileC(value);
          }}
          onChange={(editor, data, value) => {
            setFileJson(JSON.parse(editor.getValue()));
          }}
        />
      </ScriptEditor>
      <ScriptControlsHeader/>
      <ScriptEditorControls>
        <DivAutoMargin>
          <Button
            variant="secondary"
            value={1}
            onClick={e => {
              upserTrendGraph({
                variables: {
                  script: injectScript()
                }
              });
            }}
          >
            <i className="fas fa-play"/>
          </Button>
        </DivAutoMargin>
        <DivAutoMargin>
          <Button
            variant="secondary"
            value={1}
            onClick={() => {
              saveScript({
                variables: {
                  script: injectScript()
                }
              }).then().catch((e) => {
                console.log("Uacci uari uari", e);
              });
            }}
          >
            <i className="fas fa-save"/>
          </Button>
        </DivAutoMargin>
      </ScriptEditorControls>
      <ScriptOutputTabs>
        <Tabs variant="pills" id="scriptOutputTag" activeKey={key} onSelect={k => setKey(k)}>
          <Tab eventKey={KeyResponseParsed} title="Parsed" disabled={hasScriptErrors}>
          </Tab>
          <Tab eventKey={KeyResponseElaborated} title="Result" disabled={hasScriptErrors}>
          </Tab>
          <Tab eventKey={KeyResponseError} title="Errors" disabled={!hasScriptErrors}>
          </Tab>
        </Tabs>
      </ScriptOutputTabs>
      <ScriptOutput>
        <CodeMirror
          value={getResponseTab()}
          options={{
            mode: "javascript",
            theme: "material",
          }}
        />
      </ScriptOutput>
    </ScriptEditorGrid>
  );
};

