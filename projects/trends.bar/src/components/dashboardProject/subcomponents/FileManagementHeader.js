import {
  DangerColor,
  FileManagementDxMargin,
  FileManagementElement,
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

export const FileManagementHeader = ({options, callbacks}) => {

  const [files, setFiles] = useGlobal('JSONFiles');
  const [fileC, setFileC] = useGlobal('JSONFileC');
  const [currFileIndex, setCurrFileIndex] = useGlobal('JSONFileCurrentIndex');
  const [isJsonValid] = useGlobal('JSONValidator');
  const alertStore = useAlert();
  const [crawlTrendGraph, response] = useMutation(CRAWL_TREND_GRAPH);
  const [removeScript] = useMutation(REMOVE_SCRIPT);
  const [, setConfirmAlert] = useGlobal(ConfirmAlertWithWriteCheck);

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

  return (
    <Fragment>
      <FileManagementElement>
        <DropdownButton title={<i className="fas fa-tasks"/>} variant={'primary'} size='sm' drop={'down'}
                        id={`dropdown-button-drop-down`}>
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
          <Dropdown.Item
            key="delete"
            onClick={() => {
              onDeleteEntity();
            }}>
            <DangerColor><i className="fas fa-minus-circle"/></DangerColor>{" "}Delete
          </Dropdown.Item>
          <Dropdown.Item
            key="rename"
            // onClick={() => {
            //   renameScript({
            //     variables: {
            //       scriptName: currFileIndex,
            //       trendId,
            //       username,
            //       newName: "eccoci"
            //     }
            //   }).then((res) => {
            //     console.log(res);
            //     let newFiles = files;
            //     newFiles.map(elem => {
            //       if (elem.filename === currFileIndex) {
            //         elem.filename = res.data.scriptRename.filename;
            //       }
            //       return elem;
            //     });
            //     setFiles(newFiles);
            //     setCurrFileIndex(res.data.scriptRename.filename);
            //   });
            // }}
          >
            <PrimaryColor><i className="fas fa-dot-circle"/></PrimaryColor>{" "}Rename
          </Dropdown.Item>
        </DropdownButton>
        <FileManagementDxMargin/>
        <DropdownButton title={<i className="fas fa-ellipsis-h"/>} variant={'primary'} size='sm' drop={'right'}
                        id={`dropdown-button-drop-right`}>
          {files && files.map(elem => {
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
