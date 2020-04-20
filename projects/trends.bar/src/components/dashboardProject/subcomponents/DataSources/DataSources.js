import React from "reactn";
import "./DataSources.css"
import {DataSourceEditor} from "./DataSourceEditor";
import {Container, Row} from "react-bootstrap";
import {RowSeparator, RowSeparatorDouble} from "../../../../futuremodules/reactComponentStyles/reactCommon";
import {UserDataSources} from "./UserDataSources";
import {DataSourcesCreator} from "./DataSourcesCreator";
import {EditingUserTrendDataSource} from "../../../../modules/trends/globals";
import {checkBoolDefinedAndTrue} from "../../../../futuremodules/utils/utils";
import {useGlobalState} from "../../../../futuremodules/globalhelper/globalHelper";
import {Fragment} from "react";
import {ImportDataSources} from "./ImportDataSources";
import {DatasetElements} from "./DatasetElements";
import {startupState} from "../../../../modules/trends/layout";

export const DataSources = ({trendId, layout, setLayout}) => {

  const isEditingDataSource = checkBoolDefinedAndTrue(useGlobalState(EditingUserTrendDataSource));

  return (
    <Fragment>
      {!isEditingDataSource &&
      <Container fluid>
        <RowSeparator/>
        <Row>
          <DatasetElements datasets={layout.datasets}
                           keys={startupState(layout.datasets)}
                           setGroupKey={null}
                           setSubGroupKey={null}
                           setValueNameKey={null}
                           setValueFunction={null}/>
        </Row>
        <RowSeparatorDouble/>
        <UserDataSources trendId={trendId}/>
        <RowSeparator/>
        <DataSourcesCreator trendId={trendId}/>
        <RowSeparator/>
        <ImportDataSources trendId={trendId}/>
      </Container>
      }
      <DataSourceEditor layout={layout} setLayout={setLayout}/>
    </Fragment>
  );
};
