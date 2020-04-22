import React from "reactn";
import {Fragment, useEffect, useState} from "react";
import {Container, Row} from "react-bootstrap";
import {ScriptResultContainer} from "./DataSources-styled";
import {useApi} from "../../../../futuremodules/api/apiEntryPoint";
import {arrayExistsNotEmptyOnObject} from "../../../../futuremodules/utils/utils";
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

export const DataSourceEditor = ({layout, setLayout, editingDataSourceState}) => {

  const datasetState = useState(null);
  const [datasetI, setDatasetI] = datasetState;
  const [isEditingDataSource, setEditingDataSource] = editingDataSourceState;

  const fetchApi = useApi('fetch');
  const [fetchResult] = fetchApi;

  useEffect(() => {
    if (fetchResult && (
      (fetchResult.api === "scripts" && fetchResult.method === "get") ||
      (fetchResult.api === "script" && fetchResult.method === "post") ||
      (fetchResult.api === "script" && fetchResult.method === "patch") )) {
      const res = fetchResult.ret;
      console.log(fetchResult);
      // const gt = graphArrayToGraphTree2(res.graphQueries);
      setDatasetI(res);
      setEditingDataSource(true);
    }
  }, [fetchResult, setEditingDataSource, setDatasetI]);

  const hasData = arrayExistsNotEmptyOnObject(datasetI, "sourceData") && isEditingDataSource;

  return (
    <Fragment>
      {isEditingDataSource &&
      <ScriptResultContainer>
        <Container fluid>
          <DatasetElementsImporterHeader isEditingDataSource={isEditingDataSource}
                                         setEditingDataSource={setEditingDataSource}
                                         datasetI={datasetI}
                                         setDatasetI={setDatasetI}
                                         layout={layout}
                                         setLayout={setLayout}
          />
          <RowSeparatorDouble/>
          {hasData && <DatasetElementsImporter datasetState={datasetState}/>}
        </Container>
      </ScriptResultContainer>
      }
    </Fragment>
  );
};
