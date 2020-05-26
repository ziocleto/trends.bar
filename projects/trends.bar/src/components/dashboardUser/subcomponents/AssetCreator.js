import React from "reactn";
import {DashboardUserInnerMargins} from "../DashboardUser.styled";
import {Button, Form, InputGroup} from "react-bootstrap";
import {Div50} from "../../../futuremodules/reactComponentStyles/reactCommon.styled";
import {RocketTitle} from "../../../futuremodules/reactComponentStyles/reactCommon";
import {useCreateTrend} from "../DashboardUserLogic";
import {useState} from "react";

export const AssetCreator = ({state, dispatch}) => {

  const {username} = state;
  const createTrend = useCreateTrend(dispatch);
  const [newTrendFormInput, setNewTrendFormInput] = useState();

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
                          createTrend(newTrendFormInput, username);
                          e.preventDefault();
                        }
                      }}
        />
        <InputGroup.Append>
          <Button variant="info" onClick={e => {
            createTrend(newTrendFormInput, username);
            e.preventDefault();
          }}>Create</Button>
        </InputGroup.Append>
      </InputGroup>
    </Div50>
  );
};

