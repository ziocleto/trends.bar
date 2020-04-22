import React from "reactn";
import "./DataSources.css"
import {DataSourceEditor} from "./DataSourceEditor";
import {Container} from "react-bootstrap";
import {RowSeparator, RowSeparatorDouble} from "../../../../futuremodules/reactComponentStyles/reactCommon";
import {UserDataSources} from "./UserDataSources";
import {DataSourcesCreator} from "./DataSourcesCreator";
import {useState} from "react";
import {ImportDataSources} from "./ImportDataSources";

export const DataSources = ({trendId, layout, setLayout}) => {

  const editingDataSourceState = useState(false);

  return (
    <>
      {!editingDataSourceState[0] &&
      <Container fluid>
        <RowSeparatorDouble/>
        <UserDataSources trendId={trendId}/>
        <RowSeparator/>
        <DataSourcesCreator trendId={trendId}/>
        <RowSeparator/>
        <ImportDataSources trendId={trendId}/>
      </Container>
      }
      <DataSourceEditor layout={layout} setLayout={setLayout} editingDataSourceState={editingDataSourceState}/>
    </>
  );
};
