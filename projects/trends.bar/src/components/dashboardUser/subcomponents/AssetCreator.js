import React, {useState} from "reactn";
import {useAlertWarning} from "../../../futuremodules/alerts/alerts";
import {DashboardUserInnerMargins} from "../DashboardUser.styled";
import {Button, Form, InputGroup} from "react-bootstrap";
import {Div50} from "../../../futuremodules/reactComponentStyles/reactCommon.styled";
import {RocketTitle} from "../../../futuremodules/reactComponentStyles/reactCommon";
import {useCreateTrend} from "../DashboardUserLogic";

export const AssetCreator = ({state, dispatch}) => {

  const {username} = state;
  const alert = useAlertWarning();
  const [newTrendFormInput, setNewTrendFormInput] = useState();
  const createTrend = useCreateTrend(dispatch);

  const onCreateProject = e => {
    e.preventDefault();
    // NDDado: We can optionally reset the form text field with: `e.target.value = "";`
    if (!newTrendFormInput) {
      alert("I see no trend in here!");
      return;
    }
    createTrend(newTrendFormInput, username);
  };

  return (
    <Div50>
      <DashboardUserInnerMargins>
        <RocketTitle text={"Create New Trend:"}/>
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

