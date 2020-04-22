import React from "reactn";
import {Fragment, useEffect, useState} from "react";
import {Container} from "react-bootstrap";
import {ScriptResultContainer} from "./DataSources-styled";
import {useApi} from "../../../../futuremodules/api/apiEntryPoint";
import {arrayExistsNotEmpty, arrayExistsNotEmptyOnObject} from "../../../../futuremodules/utils/utils";
import {RowSeparatorDouble} from "../../../../futuremodules/reactComponentStyles/reactCommon";
import {DatasetElementsImporter} from "./DatasetElementsImporter";
import {DatasetElementsImporterHeader} from "./DatasetElementsImporterHeader";
import {editingDataSourceD} from "../../../dashboardUser/DashboardUserLogic";

// export const collectGraphData = (data) => {
//   let graphData = [];
//   for (const key in data) {
//     const graph = [];
//     for (const v of data[key]) {
//       graph.push({x: new Date(v.x), y: v.y});
//     }
//     graphData.push({
//       name: key,
//       data: graph
//     });
//   }
//   return graphData;
// };
//
// export const getGraphTitle = () => {
//   return {
//     title: graphTree.subGroupTabKey
//   }
// };

export const DataSourceEditor = ({layout, setLayout, state, dispatch}) => {

  // const datasetState = useState(null);
  // const [datasetI, setDatasetI] = datasetState;
  //
  // const fetchApi = useApi('fetch');
  // const [fetchResult] = fetchApi;
  //
  // useEffect(() => {
  //   if (fetchResult && (
  //     (fetchResult.api === "scripts" && fetchResult.method === "get") ||
  //     (fetchResult.api === "script" && fetchResult.method === "post") ||
  //     (fetchResult.api === "script" && fetchResult.method === "patch") )) {
  //     const res = fetchResult.ret;
  //     setLayout( prevState => {
  //       return {
  //         ...prevState,
  //         dataSources: [...prevState.dataSources, res]
  //       }
  //     });
  //     dispatch([editingDataSourceD, true]);
  //   }
  // }, [fetchResult, dispatch, setLayout]);

  const hasData = state.editingDataSource && arrayExistsNotEmpty(state.editingDataSource.sourceData);

  return (
    <Fragment>
      {state.editingDataSource &&
      <ScriptResultContainer>
        <Container fluid>
          <DatasetElementsImporterHeader state={state}
                                         dispatch={dispatch}
                                         layout={layout}
                                         setLayout={setLayout}
          />
          <RowSeparatorDouble/>
          {hasData && <DatasetElementsImporter state={state}
                                               dispatch={dispatch}/>}
        </Container>
      </ScriptResultContainer>
      }
    </Fragment>
  );
};
