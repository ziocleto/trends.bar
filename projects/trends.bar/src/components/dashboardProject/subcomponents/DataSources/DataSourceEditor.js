import React from "reactn";
import {Fragment, useEffect, useState} from "react";
import {Container, Row} from "react-bootstrap";
import {ScriptResultContainer} from "./DataSources-styled";
import {useApi} from "../../../../futuremodules/api/apiEntryPoint";
import {arrayExistsNotEmptyOnObject} from "../../../../futuremodules/utils/utils";
import {graphArrayToGraphTree2} from "../../../../modules/trends/dataGraphs";
import {useGlobalState, useGlobalUpdater} from "../../../../futuremodules/globalhelper/globalHelper";
import {EditingUserTrendDataSource} from "../../../../modules/trends/globals";
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

export const DataSourceEditor = ({layout, setLayout}) => {

  const [graphTree, setGraphTree] = useState(null);
  const setEditingDataSource = useGlobalUpdater(EditingUserTrendDataSource);
  const isEditingDataSource = useGlobalState(EditingUserTrendDataSource);

  const fetchApi = useApi('fetch');
  const [fetchResult] = fetchApi;

  useEffect(() => {
    if (fetchResult && (
      (fetchResult.api === "script" && fetchResult.method === "post") ||
      (fetchResult.api === "script" && fetchResult.method === "patch"))) {
      const res = fetchResult.ret;
      const gt = graphArrayToGraphTree2(res.graphQueries);
      console.log(gt);
      setGraphTree({
        script: res.script,
        tree: gt,
        groupTabKey: Object.keys(gt)[0],
        subGroupTabKey: Object.keys(gt[Object.keys(gt)[0]])[0]
      });
      setEditingDataSource(true).then();
    }
  }, [fetchResult, setEditingDataSource]);

  const hasData = arrayExistsNotEmptyOnObject(graphTree, "tree") && isEditingDataSource;

  return (
    <Fragment>
      {isEditingDataSource &&
      <ScriptResultContainer>
        <Container fluid>
          <DatasetElementsImporterHeader isEditingDataSource={isEditingDataSource}
                                         setEditingDataSource={setEditingDataSource}
                                         graphTree={graphTree}
                                         setGraphTree={setGraphTree}
                                         layout={layout}
                                         setLayout={setLayout}
          />
          <RowSeparatorDouble/>
          {hasData &&
          <Fragment>
            <Row>
              <DatasetElementsImporter graphTree={graphTree} setGraphTree={setGraphTree}/>
            </Row>
            {/*<Row>*/}
            {/*  <Col>*/}
            {/*    <GraphXY graphData={collectGraphData(graphTree.tree[graphTree.groupTabKey][graphTree.subGroupTabKey])}*/}
            {/*             config={getGraphTitle()}*/}
            {/*    />*/}
            {/*  </Col>*/}
            {/*</Row>*/}
          </Fragment>
          }
        </Container>
      </ScriptResultContainer>
      }
    </Fragment>
  );
};
