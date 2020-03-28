import "./ShowRenameAndDeleteLabel.css"
import React, {useEffect, useRef, useState} from "react";
import {InputMode, LabelMode, ShowRenameAndDeleteLabelContainer} from "./ShowRenameAndDeleteLabel.styled";
import {useMutation} from "@apollo/react-hooks";
import {RENAME_SCRIPT} from "../../../modules/trends/mutations";
import {useGlobal} from "reactn";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

export const ShowRenameAndDeleteLabel = () => {

  const searchBox = useRef(null);
  const [files, setFiles] = useGlobal('JSONFiles');
  const [currFileIndex, setCurrFileIndex] = useGlobal('JSONFileCurrentIndex');
  const [isRenamingFilename, setIsRenamingFilename] = useState(false);
  const [renameScript] = useMutation(RENAME_SCRIPT);

  useEffect(() => {
    if (isRenamingFilename && searchBox.current) {
      searchBox.current.focus();
    }
  }, [isRenamingFilename]);

  const trendId = "coronavirus";
  const username = "Dado";

  const ret = isRenamingFilename ?
    (
      <InputMode>
        <input
          ref={searchBox}
          defaultValue={currFileIndex}
          type="text"
          className="rename-bar"
          id="rename-bar"
          autoComplete={"off"}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              if (event.target.value !== currFileIndex) {
                renameScript({
                  variables: {
                    scriptName: currFileIndex,
                    trendId,
                    username,
                    newName: event.target.value
                  }
                }).then((res) => {
                  console.log(res);
                  let newFiles = files;
                  newFiles.map(elem => {
                    if (elem.filename === currFileIndex) {
                      elem.filename = res.data.scriptRename.filename;
                    }
                    return elem;
                  });
                  setFiles(newFiles);
                  setCurrFileIndex(res.data.scriptRename.filename);
                });
              }
              setIsRenamingFilename(false);
            }
            if (event.key === "Escape") {
              setIsRenamingFilename(false);
            }
          }}
          onBlur={() => {
            setIsRenamingFilename(false);
          }}
        />
      </InputMode>
    ) :
    (
      <OverlayTrigger
        placement="top"
        overlay={(props) => {
          return (
            <Tooltip id="button-tooltip" {...props}>
              Filename - Click to rename it
            </Tooltip>
          );
        }}
      >
        <LabelMode>
          {currFileIndex}
        </LabelMode>
      </OverlayTrigger>
    )

  return (
    <ShowRenameAndDeleteLabelContainer onClick={() => {
      if (!isRenamingFilename) setIsRenamingFilename(!isRenamingFilename)
    }}>
      {ret}
    </ShowRenameAndDeleteLabelContainer>
  )
};
