import React from "reactn";
import {Fragment} from "react";
import {Container} from "react-bootstrap";
import {ScriptResultContainer} from "./DataSources-styled";
import {arrayExistsNotEmpty} from "../../../../futuremodules/utils/utils";
import {RowSeparatorDouble} from "../../../../futuremodules/reactComponentStyles/reactCommon";
import {DatasetElementsImporter} from "./DatasetElementsImporter";
import {DatasetElementsImporterHeader} from "./DatasetElementsImporterHeader";

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
