import React from "reactn";
import {DataSourcesContainer} from "./DataSources-styled";
import "./DataSources.css"
import {ScriptEditor} from "./ScriptEditor";
import {Container} from "react-bootstrap";
import {RowSeparatorDouble} from "../../../../futuremodules/reactComponentStyles/reactCommon";
import {UserDataSources} from "./UserDataSources";
import {DataSourcesCreator} from "./DataSourcesCreator";

export const DataSources = () => {

  return (
    <DataSourcesContainer>
      <Container fluid>
        <UserDataSources/>
        <RowSeparatorDouble/>
        <DataSourcesCreator/>
      </Container>
      <ScriptEditor/>
    </DataSourcesContainer>
  );
};
