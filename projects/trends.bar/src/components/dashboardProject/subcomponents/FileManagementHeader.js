import {
  DangerColorDiv,
  FileManagementDxMargin,
  FileManagementElement,
  FileManagementSxPadding,
  InfoColor
} from "./GatherEditor-styled";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import React, {useGlobal} from "reactn";
import {Fragment, useEffect} from "react";
import {
  alertDangerNoMovie,
  ConfirmAlertWithWriteCheck,
  useAlert,
  useConfirmAlertWithWriteCheck
} from "../../../futuremodules/alerts/alerts";
import {useLazyQuery, useMutation} from "@apollo/react-hooks";
import {CRAWL_TREND_GRAPH, REMOVE_SCRIPT} from "../../../modules/trends/mutations";
import {ShowRenameAndDeleteLabel} from "./ShowRenameAndDeleteLabel";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import {getScript} from "../../../modules/trends/queries";

export const FileManagementHeader = ({options, callbacks}) => {

  const [files, setFiles] = useGlobal('JSONFiles');
  const [fileC, setFileC] = useGlobal('JSONFileC');
  const [currFileIndex, setCurrFileIndex] = useGlobal('JSONFileCurrentIndex');
  const [isJsonValid] = useGlobal('JSONValidator');
  const alertStore = useAlert();
  const [crawlTrendGraph, response] = useMutation(CRAWL_TREND_GRAPH);
  const [removeScript] = useMutation(REMOVE_SCRIPT);
  const [lazyScriptCheck, lazyScriptCheckResult] = useLazyQuery(getScript());
  const setConfirmAlert = useConfirmAlertWithWriteCheck();

  const trendId = "coronavirus";
  const username = "Dado";

  if (files && files.length > 0 && !currFileIndex) {
    setCurrFileIndex(files[0].filename).then();
  }// : (options ? options.defaultFilename : null));

  const onRunCallback = () => {
    let fileJsonInjected = JSON.parse(fileC);
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
      alertDangerNoMovie(alertStore, "Auch, I didn't see that coming :/");
      console.log("Uacci uari uari", e);
    });
  };

  const removeLocalCurrFileIndex = () => {
    let newFiles = files.filter(elem => (elem.filename !== currFileIndex));
    setFiles(newFiles).then(() => {
      if (files.length > 0) {
        setCurrFileIndex(files[0].filename);
        setFileC(files[0].text);
      } else {
        setFileC("");
      }
    });
  };

  const onDeleteEntity = () => {
    // Run a pre-check if the file is on the server
    // If it's not on the server then just delete it locally
    // eslint-disable-next-line react-hooks/rules-of-hooks
    lazyScriptCheck( {
      variables: {
        scriptName: currFileIndex,
        trendId,
        username
      }
    });
  };

  useEffect(() => {
    if ( lazyScriptCheckResult.data && lazyScriptCheckResult.data.script !== null && lazyScriptCheckResult.loading === false ) {
      setConfirmAlert({
        title: "Deletion of " + currFileIndex,
        text: currFileIndex,
        noText: "No, I've changed my mind",
        yesText: "Yes, do it",
        yesType: "danger",
        yesCallback: async () => {
          removeScript({
            variables: {
              scriptName: currFileIndex,
              trendId,
              username,
            }
          }).then((res) => {
            if (res.data.scriptRemove === null) {
              removeLocalCurrFileIndex()
            } else {
              setFiles(res.data.scriptRemove).then(() => {
                if (res.data.scriptRemove.length > 0) {
                  setCurrFileIndex(res.data.scriptRemove[0].filename);
                  setFileC(res.data.scriptRemove[0].text);
                } else {
                  setFileC("");
                }
              });
            }
          }).catch((e) => {
            alertDangerNoMovie(alertStore, "SOmething went very wrong on deletion, calling the ghostbusters");
          });
        },
      });
    }
    if ( lazyScriptCheckResult.data && lazyScriptCheckResult.data.script === null && lazyScriptCheckResult.loading === false ) {
      removeLocalCurrFileIndex();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lazyScriptCheckResult]);

  return (
    <Fragment>
      <FileManagementElement>
        <DropdownButton title={<i className="fas fa-list"/>} variant={'primary'} size='sm' drop={'down'}>
          <Dropdown.Item
            key="add"
            variant={"primary"}
            onClick={() => {
              let newFiles = files;
              let filename = "script" + (files.length + 1).toString();
              // Check filename is not used yet
              let fc = 0;
              while (files.includes(filename)) {
                filename = "script" + (files.length + ++fc).toString();
              }
              const fileContent = "{}";
              newFiles.push({
                filename: filename,
                text: fileContent
              });
              setFiles(newFiles).then();
              setCurrFileIndex(filename).then();
              setFileC(fileContent).then();
            }}>
            <InfoColor><i className="fas fa-plus-circle"/></InfoColor>{" "}Add new
          </Dropdown.Item>
          {
            files && files.map(elem => {
              return (
                <Dropdown.Item
                  key={elem.filename}
                  onClick={() => {
                    setCurrFileIndex(elem.filename).then();
                    setFileC(elem.text).then();
                  }}>
                  <i className="far fa-file-code"/>{" "}{elem.filename}
                </Dropdown.Item>)
            })}
        </DropdownButton>
      </FileManagementElement>
      <FileManagementElement>
        <ShowRenameAndDeleteLabel label={currFileIndex}/>
        <FileManagementSxPadding/>
        <OverlayTrigger
          overlay={(props) => {
            return (
              <Tooltip {...props}>
                Delete script
              </Tooltip>
            );
          }}
        >
          <DangerColorDiv
            onClick={() => onDeleteEntity()}
          >
            <i className="fas fa-minus-circle"/>
          </DangerColorDiv>
        </OverlayTrigger>
      </FileManagementElement>
      <FileManagementElement>
        <FileManagementDxMargin>
          <Button size={"sm"}
                  variant={"info"}
                  disabled={!isJsonValid}
                  onClick={() => {
                    onRunCallback()
                  }}
          ><i className="fas fa-play"/></Button>
        </FileManagementDxMargin>
      </FileManagementElement>
    </Fragment>
  )
};
