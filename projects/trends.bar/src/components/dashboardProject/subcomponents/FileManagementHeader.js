import {
  DangerColor, DangerColorDiv,
  FileManagementDxMargin,
  FileManagementElement, FileManagementSxPadding,
  InfoColor,
  PrimaryColor
} from "./GatherEditor-styled";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import React, {useGlobal} from "reactn";
import {Fragment, useState} from "react";
import {alertDangerNoMovie, ConfirmAlertWithWriteCheck, useAlert} from "../../../futuremodules/alerts/alerts";
import {useMutation} from "@apollo/react-hooks";
import {CRAWL_TREND_GRAPH, REMOVE_SCRIPT, RENAME_SCRIPT} from "../../../modules/trends/mutations";
import {ShowRenameAndDeleteLabel} from "./ShowRenameAndDeleteLabel";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import {InputMode} from "./ShowRenameAndDeleteLabel.styled";

export const FileManagementHeader = ({options, callbacks}) => {

  const [files, setFiles] = useGlobal('JSONFiles');
  const [fileC, setFileC] = useGlobal('JSONFileC');
  const [currFileIndex, setCurrFileIndex] = useGlobal('JSONFileCurrentIndex');
  const [isJsonValid] = useGlobal('JSONValidator');
  const alertStore = useAlert();
  const [crawlTrendGraph, response] = useMutation(CRAWL_TREND_GRAPH);
  const [removeScript] = useMutation(REMOVE_SCRIPT);
  const [, setConfirmAlert] = useGlobal(ConfirmAlertWithWriteCheck);

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

  const onDeleteEntity = () => {
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
          console.log(res);
          setFiles(res.data.scriptRemove);
          if (res.data.scriptRemove.length > 0) {
            setCurrFileIndex(res.data.scriptRemove[0].filename);
          } else {
            setFileC("");
          }
        });
      },
    });
  };

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
        <ShowRenameAndDeleteLabel label={currFileIndex}></ShowRenameAndDeleteLabel>
        <FileManagementSxPadding/>
        <OverlayTrigger
          overlay={(props) => {
            return (
              <Tooltip id="button-tooltip" {...props}>
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
