import {FileManagementAddAndSelect} from "./GatherEditor-styled";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import React, {useGlobal} from "reactn";
import {Fragment} from "react";

export const FileManagementHeader = ({options, callbacks}) => {

  const [files, setFiles] = useGlobal('JSONFiles');
  const [fileC, setFileC] = useGlobal('JSONFileC');
  const [currFileIndex, setCurrFileIndex] = useGlobal('JSONFileCurrentIndex');

  console.log("CurrFileIndex", currFileIndex);
  if (files && files.length > 0 && !currFileIndex ) {
    setCurrFileIndex(files[0].filename).then();
  }// : (options ? options.defaultFilename : null));

  return (
    <Fragment>
      <FileManagementAddAndSelect>
        <Button
          size={"sm"}
          variant={"primary"}
          onClick={() => {
            let newFiles = files;
            newFiles.push( {
              filename:"script10",
              text:"{}"
            });
            setFiles(newFiles).then();
          }}
        ><i className="fas fa-plus-circle"/></Button>
        <DropdownButton title={currFileIndex} variant={'info'} size='sm' drop={'right'} id={`dropdown-button-drop-right`}>
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
      </FileManagementAddAndSelect>
      <div>
        <Button size={"sm"} variant={"danger"}><i className="fas fa-minus-circle"/></Button>
      </div>
    </Fragment>
  )
};
