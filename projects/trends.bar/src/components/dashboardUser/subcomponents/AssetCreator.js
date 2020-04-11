import React, {useState, withGlobal} from "reactn";
import {useAlertWarning} from "../../../futuremodules/alerts/alerts";
import {useCreateTrend} from "../../../modules/trends/mutations";
import {DashboardUserInnerMargins} from "../DashboardUser.styled";
import {getAuthUserName, getAuthWithGlobal} from "../../../futuremodules/auth/authAccessors";
import {Button, Form, InputGroup} from "react-bootstrap";
import {Div50} from "../../../futuremodules/reactComponentStyles/reactCommon.styled";

const AssetCreator = (props) => {

  const alert = useAlertWarning();
  const [newTrendFormInput, setNewTrendFormInput] = useState();
  const createTrend = useCreateTrend();

  const onCreateProject = e => {
    e.preventDefault();
    // NDDado: We can optionally reset the form text field with: `e.target.value = "";`
    if (!newTrendFormInput) {
      alert("I see no trend in here!");
      return;
    }
    createTrend(newTrendFormInput, getAuthUserName(props.auth));
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

