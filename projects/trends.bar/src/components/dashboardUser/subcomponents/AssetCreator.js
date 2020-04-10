import React, {Fragment, useGlobal, useState, withGlobal} from "reactn";
import {alertWarning, NotificationAlert} from "../../../futuremodules/alerts/alerts";
import {useMutation} from "@apollo/react-hooks";
import {CREATE_TREND} from "../../../modules/trends/mutations";
import {DashboardUserInnerMargins} from "../DashboardUser.styled";
import {getAuthUserName, getAuthWithGlobal} from "../../../futuremodules/auth/authAccessors";
import {Button, Form, InputGroup} from "react-bootstrap";

const AssetCreator = (props) => {

  const [,alertStore] = useGlobal(NotificationAlert);
  const [createTrendM] = useMutation(CREATE_TREND);
  const [newTrendFormInput, setNewTrendFormInput] = useState();
  const name = getAuthUserName(props.auth);

  const onCreateProject = e => {
    e.preventDefault();
    if (!newTrendFormInput) {
      alertWarning(alertStore, "I see no trend in here!");
      return;
    }
    createTrendM({
      variables: {
        trendId: newTrendFormInput,
        username: name
      }
    }).then().catch((e) => {
      alertWarning(alertStore, "Big problem with this trend");
    });
  };

  return (
    <Fragment>
      <DashboardUserInnerMargins>
        <i className="fas fa-plus-circle"/> Create New Trend
      </DashboardUserInnerMargins>
      <InputGroup className="mb-1">
        <Form.Control name="projectNew" placeholder="Trend Name"
                      onChange={e => setNewTrendFormInput(e.target.value)}/>
        <InputGroup.Append>
          <Button variant="info" onClick={e => onCreateProject(e)}>Create</Button>
        </InputGroup.Append>
      </InputGroup>
    </Fragment>
  );
};

export default withGlobal(
  global => getAuthWithGlobal(global)
)(AssetCreator);

