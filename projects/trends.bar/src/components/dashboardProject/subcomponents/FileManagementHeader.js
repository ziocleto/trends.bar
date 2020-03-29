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
import {alertDangerNoMovie, useAlert, useConfirmAlertWithWriteCheck} from "../../../futuremodules/alerts/alerts";
import {useLazyQuery, useMutation} from "@apollo/react-hooks";
import {REMOVE_SCRIPT} from "../../../modules/trends/mutations";
import {LabelWithRename} from "./LabelWithRename";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import {getScript} from "../../../modules/trends/queries";
import {EditingUserTrend, generateUniqueNameWithArrayCheck} from "../../../modules/trends/globals";
import {checkQueryHasLoadedWith} from "../../../futuremodules/graphqlclient/query";

export const FileManagementHeader = ({username, onRunCallback}) => {

  const [trendId] = useGlobal(EditingUserTrend);
  const [files, setFiles] = useGlobal('JSONFiles');
  const [currFileIndex, setCurrFileIndex] = useGlobal('JSONFileCurrentIndex');
  const [isJsonValid] = useGlobal('JSONValidator');
  const alertStore = useAlert();
  const [removeScript] = useMutation(REMOVE_SCRIPT);
  const [lazyScriptCheck, lazyScriptCheckResult] = useLazyQuery(getScript());
  const setConfirmAlert = useConfirmAlertWithWriteCheck();

  const removeLocalCurrFileIndex = () => {
    let newFiles = files.filter(elem => (elem.filename !== currFileIndex));
    setFiles(newFiles).then(() => {
      if (files.length > 0) {
        setCurrFileIndex(files[0].filename);
      }
    });
  };

  const onDeleteEntity = () => {
    // Run a pre-check if the file is on the server
    // If it's not on the server then just delete it locally
    lazyScriptCheck({
      variables: {
        scriptName: currFileIndex,
        trendId,
        username
      }
    });
  };

  // USe effect here is used a toggle to detect deletion hooks fired
  useEffect(() => {
    if (checkQueryHasLoadedWith(lazyScriptCheckResult, "script")) {
      console.log("Lets confirm");
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
                }
              });
            }
          }).catch((e) => {
            alertDangerNoMovie(alertStore, "Something went very wrong on deletion, calling the GhostBusters");
          });
        },
      });
    }
    if (lazyScriptCheckResult.data && lazyScriptCheckResult.data.script === null && lazyScriptCheckResult.loading === false) {
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
              // Create mew filename and check that it doesnt exist yet
              const filename = generateUniqueNameWithArrayCheck(files);
              const fileContent = "{}";
              newFiles.push({
                filename: filename,
                text: fileContent
              });
              setFiles(newFiles).then();
              setCurrFileIndex(filename).then();
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
                  }}>
                  <i className="far fa-file-code"/>{" "}{elem.filename}
                </Dropdown.Item>)
            })}
        </DropdownButton>
      </FileManagementElement>
      <FileManagementElement>
        <LabelWithRename username={username}/>
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
