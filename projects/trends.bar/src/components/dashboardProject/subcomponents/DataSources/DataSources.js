import React from "reactn";
import {DataSourcesContainer} from "./DataSources-styled";
import "./DataSources.css"
import {ScriptEditor} from "./ScriptEditor";
import {Container} from "react-bootstrap";
import {RowSeparatorDouble} from "../../../../futuremodules/reactComponentStyles/reactCommon";
import {UserDataSources} from "./UserDataSources";
import {DataSourcesCreator} from "./DataSourcesCreator";
import {EditingUserTrendDataSource} from "../../../../modules/trends/globals";
import {checkBoolDefinedAndTrue} from "../../../../futuremodules/utils/utils";
import {useGlobalState} from "../../../../futuremodules/globalhelper/globalHelper";
import {Fragment} from "react";

export const DataSources = () => {

  const isEditingDataSource = checkBoolDefinedAndTrue(useGlobalState(EditingUserTrendDataSource));

  return (
    <Fragment>
      <DataSourcesContainer>
        {!isEditingDataSource &&
        <Container fluid>
          <UserDataSources/>
          <RowSeparatorDouble/>
          <DataSourcesCreator/>
        </Container>
        }
      </DataSourcesContainer>
      <ScriptEditor/>
    </Fragment>
  );
};
