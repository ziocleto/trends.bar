import {FileManagementDxMargin, FileManagementElement} from "./GatherEditor-styled";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import React, {useGlobal} from "reactn";
import {Fragment} from "react";
import {alertDangerNoMovie, useAlert} from "../../../futuremodules/alerts/alerts";
import {useMutation} from "@apollo/react-hooks";
import {CRAWL_TREND_GRAPH, REMOVE_SCRIPT, RENAME_SCRIPT} from "../../../modules/trends/mutations";

export const FileManagementHeader = ({options, callbacks}) => {

  const [files, setFiles] = useGlobal('JSONFiles');
  const [fileC, setFileC] = useGlobal('JSONFileC');
  const [currFileIndex, setCurrFileIndex] = useGlobal('JSONFileCurrentIndex');
  const [isJsonValid] = useGlobal('JSONValidator');
  const alertStore = useAlert();
  const [crawlTrendGraph, response] = useMutation(CRAWL_TREND_GRAPH);
  const [removeScript] = useMutation(REMOVE_SCRIPT);
  const [renameScript] = useMutation(RENAME_SCRIPT);

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
        <FileManagementDxMargin>
          <Button
            size={"sm"}
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
            <i className="fas fa-plus-circle"/>
          </Button>
        </FileManagementDxMargin>
        <DropdownButton title={currFileIndex ? currFileIndex : ""} variant={'primary'} size='sm' drop={'right'}
                        id={`dropdown-button-drop-right`}>
          {files && files.map(elem => {
            return (
              <Dropdown.Item
                key={elem.filename}
                onClick={() => {
                  setCurrFileIndex(elem.filename).then();
                  setFileC(elem.text).then();
                }}>
                {elem.filename}
              </Dropdown.Item>)
          })}
        </DropdownButton>
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
        <DropdownButton title={<i className="fas fa-ellipsis-h"/>} variant={'primary'} size='sm' drop={'down'}
                        id={`dropdown-button-drop-down`}>
          <Dropdown.Item
            key="delete"
            onClick={() => {
              // Implement remote delete
              const newFiles = files.filter(value => value.filename !== currFileIndex);
              console.log(newFiles);
              setFiles(newFiles).then(
                (res) => {
//                  console.log(res);
                  setCurrFileIndex(files[0].filename).then();
                  setFileC(files[0].text).then();
                }
              );
            }}>
            Delete
          </Dropdown.Item>
          <Dropdown.Item
            key="rename"
            onClick={() => {
              // Implement remote rename
              renameScript({
                variables: {
                  scriptName: currFileIndex,
                  trendId,
                  username,
                  newName: "eccoci"
                }
              }).then((res) => {
                console.log(res);
                let newFiles = files;
                newFiles.map(elem => {
                  if (elem.filename === currFileIndex) {
                    elem.filename = res.data.scriptRename.filename;
                  }
                });
                setFiles(newFiles);
                setCurrFileIndex(res.data.scriptRename.filename);
              });
            }}>
            Rename
          </Dropdown.Item>
        </DropdownButton>
      </FileManagementElement>
    </Fragment>
  )
};
