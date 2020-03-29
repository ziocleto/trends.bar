import "./LabelWithRename.css"
import React, {useEffect, useRef, useState} from "react";
import {InputMode, LabelMode, ShowRenameAndDeleteLabelContainer} from "./LabelWithRename.styled";
import {useMutation} from "@apollo/react-hooks";
import {RENAME_SCRIPT} from "../../../modules/trends/mutations";
import {useGlobal} from "reactn";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import {EditingUserTrend} from "../../../modules/trends/globals";

export const LabelWithRename = ({username}) => {

  const searchBox = useRef(null);
  const [trendId] = useGlobal(EditingUserTrend);
  const [files, setFiles] = useGlobal('JSONFiles');
  const [currFileIndex, setCurrFileIndex] = useGlobal('JSONFileCurrentIndex');
  const [isRenamingFilename, setIsRenamingFilename] = useState(false);
  const [renameScript] = useMutation(RENAME_SCRIPT);

  useEffect(() => {
    if (isRenamingFilename && searchBox.current) {
      searchBox.current.focus();
    }
  }, [isRenamingFilename]);

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
              const newFileName = event.target.value
              if (newFileName !== currFileIndex) {
                renameScript({
                  variables: {
                    scriptName: currFileIndex,
                    trendId,
                    username,
                    newName: newFileName
                  }
                }).then((res) => {
                  console.log(res);
                  // if ( res.data.scriptRename ) {
                  //
                  // }
                  let newFiles = files;
                  newFiles.map(elem => {
                    if (elem.filename === currFileIndex) {
                      elem.filename = newFileName;
                    }
                    return elem;
                  });
                  setFiles(newFiles);
                  setCurrFileIndex(newFileName);
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
