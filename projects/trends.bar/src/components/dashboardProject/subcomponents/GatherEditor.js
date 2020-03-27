import React, {Fragment, useState} from "reactn";
import {Controlled as CodeMirror} from "react-codemirror2";
import Button from "react-bootstrap/Button";
import {
  DivAutoMargin,
  ScriptControlsHeader,
  ScriptEditor,
  ScriptEditorControls,
  ScriptEditorGrid,
  ScriptOutput,
  ScriptOutputTabs,
  ScriptResultTabs,
  ScriptTitle
} from "./GatherEditor-styled";
import {useMutation, useQuery} from "@apollo/react-hooks";
import {CRAWL_TREND_GRAPH, UPSERT_TREND_GRAPH} from "../../../modules/trends/mutations";
import {getScripts} from "../../../modules/trends/queries";
import "./GatherEditor.css"
import {Tab, Tabs} from "react-bootstrap";
import 'codemirror/addon/lint/lint.css';
import {alertDangerNoMovie, alertSuccess, useAlert} from "../../../futuremodules/alerts/alerts";
import {FileManagementHeader} from "./FileManagementHeader";
import {JSONEditor, useJSONEditorGetFile, useJSONEditorSetFiles} from "./JSONEditor";

require("codemirror/lib/codemirror.css");
require("codemirror/theme/material.css");
require("codemirror/theme/neat.css");
require('codemirror/addon/lint/lint');
require('codemirror/addon/lint/json-lint');
require("codemirror/mode/javascript/javascript.js");
const jsonlint = require("jsonlint-mod");

window.jsonlint = jsonlint;

const KeyResponseParsed = 'parsed';
const KeyResponseElaborated = 'elaborated';
const KeyResponseError = 'error';

export const ScriptCodeEditor = ({trendId, username}) => {
  const [key, setKey] = useState(KeyResponseElaborated);

  const alertStore = useAlert();
  const scriptQuery = useQuery(getScripts(), {variables: {trendId, username}});
  const [crawlTrendGraph, response] = useMutation(CRAWL_TREND_GRAPH);
  const [upsertTrendGraph] = useMutation(UPSERT_TREND_GRAPH);

  useJSONEditorSetFiles(scriptQuery.loading === true ? null : scriptQuery.data.scripts);
  const jsonFile = useJSONEditorGetFile();

  if (scriptQuery.loading === true) {
    return <Fragment/>
  }

  const injectScript = () => {
    let fileJsonInjected = jsonFile.text;
    fileJsonInjected.trendId = trendId;
    fileJsonInjected.username = username;
    return fileJsonInjected;
  }

  let hasScriptErrors = false;
  let hasCompletedSuccessful = false;
  if ((response.data && response.loading === false)) {
    if (response.error || response.data.crawlTrendGraph.error) {
      hasScriptErrors = true;
      hasCompletedSuccessful = false;
      if (key !== KeyResponseError) setKey(KeyResponseError);
    } else {
      hasCompletedSuccessful = true;
      if (key === KeyResponseError) setKey(KeyResponseElaborated);
    }
  }

  const getResponseTab = () => {
    if (!response.data) {
      return "";
    }
    console.log(response.data.crawlTrendGraph);

    if (key === KeyResponseParsed) {
      return response.data.crawlTrendGraph.crawledText;
    }
    if (key === KeyResponseElaborated) {
      return response.data.crawlTrendGraph.traces;
    }
    if (key === KeyResponseError) {
      if (response.data.crawlTrendGraph.error) return response.data.crawlTrendGraph.error;
      return response.error;
    }
  };

  return (
    <ScriptEditorGrid>
      <ScriptTitle>
        <FileManagementHeader options={{defaultFilename: "script1"}}/>
      </ScriptTitle>
      <ScriptEditor>
        <JSONEditor/>
      </ScriptEditor>
      <ScriptOutputTabs>
        <ScriptResultTabs>
          <Tabs variant="pills" id="scriptOutputTag" activeKey={key} onSelect={k => setKey(k)}>
            <Tab eventKey={KeyResponseParsed} title="Parsed" disabled={hasScriptErrors}>
            </Tab>
            <Tab eventKey={KeyResponseElaborated} title="Result" disabled={hasScriptErrors}>
            </Tab>
            <Tab eventKey={KeyResponseError} title="Errors" disabled={!hasScriptErrors}>
            </Tab>
          </Tabs>
        </ScriptResultTabs>
        <ScriptResultTabs>
          <Button variant={"success"}
                  disabled={!hasCompletedSuccessful}
                  size={"sm"}
                  onClick={() => {
                    upsertTrendGraph({
                      variables: {
                        graphQueries: response.data.crawlTrendGraph.graphQueries
                      }
                    }).then(() =>
                      alertSuccess(alertStore, "All set and done!")
                    ).catch((e) => {
                      console.log("Uacci uari uari", e);
                    });
                  }}>
            Publish
          </Button>
        </ScriptResultTabs>
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

