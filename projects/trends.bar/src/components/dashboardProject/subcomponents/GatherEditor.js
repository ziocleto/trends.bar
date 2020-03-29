import React, {Fragment, useGlobal, useState} from "reactn";
import {Controlled as CodeMirror} from "react-codemirror2";
import Button from "react-bootstrap/Button";
import {
  ScriptEditor,
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
import {JSONEditor} from "./JSONEditor";
import {useEffect} from "react";
import {EditingUserTrend, generateUniqueNameWithArrayCheck} from "../../../modules/trends/globals";
import {
  checkQueryArrayNotEmpty,
  checkQueryHasLoadedWithData,
  queryGetValue
} from "../../../futuremodules/graphqlclient/query";

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

export const ScriptCodeEditor = ({username}) => {

  const [key, setKey] = useState(KeyResponseElaborated);
  const alertStore = useAlert();
  const [trendId] = useGlobal(EditingUserTrend);
  const scriptQueryResult = useQuery(getScripts(), {variables: {trendId: trendId ? trendId : "", username}});

  const [crawlTrendGraph, response] = useMutation(CRAWL_TREND_GRAPH);
  const [upsertTrendGraph] = useMutation(UPSERT_TREND_GRAPH);
  const [files, setFiles] = useGlobal('JSONFiles');
  const [fileJson] = useGlobal('JSONFileJson');
  const [currFileIndex, setCurrFileIndex] = useGlobal('JSONFileCurrentIndex');

  const createDefaultScriptFile = (defaultText) => {
    const defaultFileName = generateUniqueNameWithArrayCheck(files);
    const newFile = {
      filename: defaultFileName,
      text: defaultText
    };
    const newFiles = [];
    newFiles.push(newFile);
    setFiles(newFiles).then(() => {
      setCurrFileIndex(defaultFileName).then();
    });
  };

  const onRunCallback = () => {
    let fileJsonInjected = fileJson;
    fileJsonInjected.trendId = trendId;
    fileJsonInjected.username = username;
    crawlTrendGraph({
      variables: {
        scriptName: currFileIndex,
        script: fileJsonInjected
      }
    }).then((res) => {
        console.log(res);
      }
    ).catch((e) => {
      alertDangerNoMovie(alertStore, "Auch, this script appears to be pants!");
    });
  };

  // We use useEffect as a "toggle" mechanism to allow refresh only when key hooks have changed, this is needed
  // in case of useQuery/useLazyQuery hooks because of their architecture of 2 steps loading of data it would be
  // impossible to discern the status of a load finished (loading===false) as an isolated event.
  useEffect(() => {
    // First check our results have loaded
    if (checkQueryHasLoadedWithData(scriptQueryResult)) {
      // If they have and they have returned something then proceed normally
      if (checkQueryArrayNotEmpty(scriptQueryResult, "scripts")) {
        setFiles(queryGetValue(scriptQueryResult, "scripts")).then((res) => {
          if (res.JSONFiles && res.JSONFiles.length > 0) {
            setCurrFileIndex(res.JSONFiles[0].filename).then();
          }
        });
      } // Doesn't have any script, create a default one
      else {
        createDefaultScriptFile("{}");
      }
    }
    // eslint-disable-next-line
  }, [scriptQueryResult, trendId, setFiles, setCurrFileIndex]);

  if (scriptQueryResult.loading === true) {
    return <Fragment/>
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
        <FileManagementHeader username={username} onRunCallback={onRunCallback}/>
      </ScriptTitle>
      <ScriptEditor>
        <JSONEditor/>
      </ScriptEditor>

      {response.data && (
        <Fragment>
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
        </Fragment>
      )}

    </ScriptEditorGrid>
  );
};

