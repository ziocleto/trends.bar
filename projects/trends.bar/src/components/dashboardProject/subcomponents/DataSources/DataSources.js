import React from "reactn";
import "./DataSources.css"
import {ScriptEditor} from "./ScriptEditor";
import {Container} from "react-bootstrap";
import {RowSeparator, RowSeparatorDouble} from "../../../../futuremodules/reactComponentStyles/reactCommon";
import {UserDataSources} from "./UserDataSources";
import {DataSourcesCreator} from "./DataSourcesCreator";
import {EditingUserTrendDataSource} from "../../../../modules/trends/globals";
import {checkBoolDefinedAndTrue} from "../../../../futuremodules/utils/utils";
import {useGlobalState} from "../../../../futuremodules/globalhelper/globalHelper";
import {Fragment} from "react";
import {ImportDataSources} from "./ImportDataSources";

export const DataSources = ({layout, setLayout}) => {

  const isEditingDataSource = checkBoolDefinedAndTrue(useGlobalState(EditingUserTrendDataSource));

  return (
    <Fragment>
      {!isEditingDataSource &&
      <Container fluid>
        <RowSeparatorDouble/>
        <UserDataSources/>
        <RowSeparator/>
        <DataSourcesCreator/>
        <RowSeparatorDouble/>
        <ImportDataSources layout={layout} setLayout={setLayout}/>
        <RowSeparator/>
        <RowSeparatorDouble/>
      </Container>
      }
      <ScriptEditor layout={layout} setLayout={setLayout}/>
    </Fragment>
  );
};
