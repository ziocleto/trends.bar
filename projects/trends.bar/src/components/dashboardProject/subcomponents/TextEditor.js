import React, {Fragment, useState} from "react";
import {Controlled as CodeMirror} from "react-codemirror2";
import Button from "react-bootstrap/Button";
import {DivAutoMargin, ScriptEditorControls, ScriptTitle} from "./TextEditor-styled";
import {useMutation, useQuery} from "@apollo/react-hooks";
import {SAVE_SCRIPT, UPSERT_TREND_GRAPH} from "../../../modules/trends/mutations";
import {getScript} from "../../../modules/trends/queries";

require("codemirror/lib/codemirror.css");
require("codemirror/theme/material.css");
require("codemirror/theme/neat.css");
require("codemirror/mode/javascript/javascript.js");

export const ScriptEditor = ({trendId, username}) => {
  const [fileJson, setFileJson] = useState({});
  const [fileC, setFileC] = useState(null);
  const {data, loading} = useQuery(getScript(), { variables: {trendId, username}});
  const [saveScript] = useMutation(SAVE_SCRIPT);
  const [upserTrendGraph, response] = useMutation(UPSERT_TREND_GRAPH);

  if ( loading === true ) {
    return <Fragment/>
  }

  const injectScript = () => {
    let fileJsonInjected = fileJson;
    fileJsonInjected.trendId = trendId;
    fileJsonInjected.username = username;
    return fileJsonInjected;
  }

  if ( response ) {
    console.log(response.data);
  }

  return (
    <Fragment>
      <ScriptTitle>
        {trendId}
      </ScriptTitle>
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
      <CodeMirror
        value={response.data ? response.data.upsertTrendGraph.text : ""}
        options={{
          mode: "javascript",
          theme: "material",
        }}
      />
    </Fragment>
  );
};

