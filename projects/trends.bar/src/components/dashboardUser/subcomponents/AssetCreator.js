import React, {useGlobal, useState, withGlobal} from "reactn";
import {alertWarning, NotificationAlert} from "../../../futuremodules/alerts/alerts";
import {useMutation} from "@apollo/react-hooks";
import {CREATE_TREND} from "../../../modules/trends/mutations";
import {DashboardUserInnerMargins} from "../DashboardUser.styled";
import {getAuthUserName, getAuthWithGlobal} from "../../../futuremodules/auth/authAccessors";
import {Button, Form, InputGroup} from "react-bootstrap";
import {Div50} from "../../../futuremodules/reactComponentStyles/reactCommon.styled";
import {currentUserTrends, EditingUserTrend} from "../../../modules/trends/globals";
import {getQueryLoadedWithValue} from "../../../futuremodules/graphqlclient/query";

const AssetCreator = (props) => {

  const [, alertStore] = useGlobal(NotificationAlert);
  const [createTrendM] = useMutation(CREATE_TREND);
  const [newTrendFormInput, setNewTrendFormInput] = useState();
  const [userTrends, setUserTrends] = useGlobal(currentUserTrends);
  const [, setEditingUserTrend] = useGlobal(EditingUserTrend);
  const name = getAuthUserName(props.auth);

  const onCreateProject = e => {
    e.preventDefault();
    e.target.value = "";
    if (!newTrendFormInput) {
      alertWarning(alertStore, "I see no trend in here!");
      return;
    }
    createTrendM({
      variables: {
        trendId: newTrendFormInput,
        username: name
      }
    }).then(r => {
        const newValue = getQueryLoadedWithValue(r);
        let trends = [ newValue, ...userTrends];
        setUserTrends(trends).then(
          () => setEditingUserTrend(newValue.trendId)
        );
      }
    ).catch((e) => {
      alertWarning(alertStore, "Big problem with this trend");
    });
  };

  return (
    <Div50>
      <DashboardUserInnerMargins>
        <i className="fas fa-plus-circle"/> Create New Trend
      </DashboardUserInnerMargins>
      <InputGroup className="mb-1">
        <Form.Control name="projectNew" placeholder="Trend Name"
                      onChange={e => setNewTrendFormInput(e.target.value)}
                      onKeyUp={(e) => {
                        if ((e.keyCode === 13 || e.keyCode === 14)) {
                          onCreateProject(e);
                        }
                      }}
        />
        <InputGroup.Append>
          <Button variant="info" onClick={e => onCreateProject(e)}>Create</Button>
        </InputGroup.Append>
      </InputGroup>
    </Div50>
  );
};

export default withGlobal(
  global => getAuthWithGlobal(global)
)(AssetCreator);

