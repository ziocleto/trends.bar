import {FileManagementDxMargin, FileManagementElement} from "./GatherEditor-styled";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import React, {useGlobal} from "reactn";
import {Fragment} from "react";
import {alertDangerNoMovie} from "../../../futuremodules/alerts/alerts";

export const FileManagementHeader = ({options, callbacks}) => {

  const [files, setFiles] = useGlobal('JSONFiles');
  const [fileC, setFileC] = useGlobal('JSONFileC');
  const [currFileIndex, setCurrFileIndex] = useGlobal('JSONFileCurrentIndex');
  const [isJsonValid] = useGlobal('JSONValidator');

  console.log("CurrFileIndex", currFileIndex);
  if (files && files.length > 0 && !currFileIndex) {
    setCurrFileIndex(files[0].filename).then();
  }// : (options ? options.defaultFilename : null));

  const onRunCallback = () => {
    // crawlTrendGraph({
    //   variables: {
    //     scriptName: jsonFile.filename,
    //     script: injectScript()
    //   }
    // }).then().catch((e) => {
    //   alertDangerNoMovie(alertStore, "Auch, I didn't see that coming :/");
    //   console.log("Uacci uari uari", e);
    // });
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
              newFiles.push({
                filename: "script10",
                text: "{}"
              });
              setFiles(newFiles).then();
            }}>
            <i className="fas fa-plus-circle"/>
          </Button>
        </FileManagementDxMargin>
        <DropdownButton title={currFileIndex} variant={'primary'} size='sm' drop={'right'}
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
                  onClick={ () => { onRunCallback() }}
          ><i className="fas fa-play"/></Button>
        </FileManagementDxMargin>
        <Button size={"sm"} variant={"primary"}><i className="fas fa-ellipsis-h"/></Button>
      </FileManagementElement>
    </Fragment>
  )
};
