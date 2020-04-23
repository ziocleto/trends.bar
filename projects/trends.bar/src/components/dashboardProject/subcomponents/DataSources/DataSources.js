import React from "reactn";
import "./DataSources.css"
import {DataSourceEditor} from "./DataSourceEditor";
import {Container} from "react-bootstrap";
import {RowSeparator, RowSeparatorDouble} from "../../../../futuremodules/reactComponentStyles/reactCommon";
import {UserDataSources} from "./UserDataSources";
import {DataSourcesCreator} from "./DataSourcesCreator";
import {ImportDataSources} from "./ImportDataSources";

export const DataSources = ({state, dispatch, layout, setLayout}) => {

  return (
    <>
      {!state.editingDataSource &&
      <Container fluid>
        <RowSeparatorDouble/>
        <UserDataSources layout={layout} dispatch={dispatch}/>
        <RowSeparator/>
        <DataSourcesCreator layout={layout} setLayout={setLayout} dispatch={dispatch}/>
        <RowSeparator/>
        <ImportDataSources editingTrend={state.editingTrend}/>
      </Container>
      }
      <DataSourceEditor layout={layout} setLayout={setLayout} state={state} dispatch={dispatch}/>
    </>
  );
};
