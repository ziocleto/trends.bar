import React from "reactn";
import {Fragment, useEffect, useState} from "react";
import {Button, Col, Container, Dropdown, Row} from "react-bootstrap";
import {
  ScriptElementsContainer,
  ScriptKeyContainer,
  ScriptKeyContainerTitle,
  ScriptResultContainer
} from "./DataSources-styled";
import {api, useApi} from "../../../../futuremodules/api/apiEntryPoint";
import {putScript} from "../../../../futuremodules/fetch/fetchApiCalls";
import {
  ButtonDiv,
  DangerColorSpan,
  Flex,
  FlexVertical,
  LightTextSpan,
  Mx1,
  SecondaryAltColorTextSpanBold
} from "../../../../futuremodules/reactComponentStyles/reactCommon.styled";
import {arrayExistsNotEmptyOnObject, arrayObjectExistsNotEmpty} from "../../../../futuremodules/utils/utils";
import {GraphXY} from "../../../../futuremodules/graphs/GraphXY";
import {alertSuccess, useAlert} from "../../../../futuremodules/alerts/alerts";
import {graphArrayToGraphTree2} from "../../../../modules/trends/dataGraphs";
import {LabelWithRename} from "../../../../futuremodules/labelWithRename/LabelWithRename";
import {useGlobalState, useGlobalUpdater} from "../../../../futuremodules/globalhelper/globalHelper";
import {EditingUserTrendDataSource} from "../../../../modules/trends/globals";
import {RowSeparator, RowSeparatorDouble} from "../../../../futuremodules/reactComponentStyles/reactCommon";
import {isStatusCodeSuccessful} from "../../../../futuremodules/api/apiStatus";

export const ScriptEditor = ({datasets, setDatasets}) => {

  const [graphTree, setGraphTree] = useState(null);
  const setEditingDataSource = useGlobalUpdater(EditingUserTrendDataSource);
  const isEditingDataSource = useGlobalState(EditingUserTrendDataSource);
  const fetchApi = useApi('fetch');
  const [fetchResult] = fetchApi;
  const alertStore = useAlert();

  useEffect(() => {
    if (fetchResult && (
      (fetchResult.api === "script" && fetchResult.method === "post") ||
      (fetchResult.api === "script" && fetchResult.method === "patch"))) {
      const res = fetchResult.ret;
      const gt = graphArrayToGraphTree2(res.graphQueries, "yValueGroup", "yValueSubGroup", "yValueName", "values");
      console.log(gt);
      const groupTabKey = Object.keys(gt)[0];
      const subGroupTabKey = Object.keys(gt[groupTabKey])[0];
      setGraphTree({
        script: res.script,
        tree: gt,
        groupTabKey: groupTabKey,
        subGroupTabKey: subGroupTabKey
      });
      setEditingDataSource(true).then();
    }
  }, [fetchResult, setEditingDataSource]);

  const setFirstGroupKey = (gt) => {
    let hasOne = true;
    if (!arrayObjectExistsNotEmpty(gt.tree)) {
      hasOne = false;
    }
    if (hasOne) {
      for (const elem of Object.keys(gt.tree)) {
        if (arrayObjectExistsNotEmpty(gt.tree[elem])) {
          gt.groupTabKey = elem;
          getFirstSubGroupKey(gt);
          hasOne = true;
          break;
        }
      }
    }
    if (!hasOne) {
      gt.groupTabKey = null;
      gt.subGroupTabKey = null;
      delete gt.tree;
    }
  };

  const getFirstSubGroupKey = (gt) => {
    if (arrayObjectExistsNotEmpty(gt.tree[gt.groupTabKey])) {
      gt.subGroupTabKey = Object.keys(gt.tree[gt.groupTabKey])[0];
    }
  };

  const setFirstSubGroupKey = (gt) => {
    if (arrayObjectExistsNotEmpty(gt.tree[gt.groupTabKey])) {
      gt.subGroupTabKey = Object.keys(gt.tree[gt.groupTabKey])[0];
    } else {
      delete gt.tree[gt.groupTabKey];
      setFirstGroupKey(gt);
    }
  };

  const setGroupKey = (e, gk) => {
    e.stopPropagation();
    let tmp = graphTree;
    tmp.groupTabKey = gk;
    getFirstSubGroupKey(tmp);
    setGraphTree({...tmp});
  };

  const setSubGroupKey = (e, sgk) => {
    e.stopPropagation();
    setGraphTree({
      ...graphTree,
      subGroupTabKey: sgk
    });
  };

  const onDeleteEntity = (e, elem) => {
    e.stopPropagation();
    let tmp = graphTree;
    delete tmp.tree[graphTree.groupTabKey][graphTree.subGroupTabKey][elem];
    if (Object.keys(tmp.tree[graphTree.groupTabKey][graphTree.subGroupTabKey]).length === 0) {
      delete tmp.tree[graphTree.groupTabKey][graphTree.subGroupTabKey];
      setFirstSubGroupKey(tmp);
    }
    tmp.script.keys.y = tmp.script.keys.y.filter(eg => eg.key !== elem);
    setGraphTree({...tmp});
  };

  const onDeleteSubGroup = (e, elem) => {
    e.stopPropagation();
    let tmp = graphTree;
    delete tmp.tree[graphTree.groupTabKey][elem];
    setFirstSubGroupKey(tmp);
    setGraphTree({...tmp});
  };

  const onDeleteGroup = (e, elem) => {
    e.stopPropagation();
    let tmp = graphTree;
    delete tmp.tree[elem];
    tmp.script.keys.group = tmp.script.keys.group.filter(eg => eg.yValueGroup !== elem);
    setFirstGroupKey(tmp);
    setGraphTree({...tmp});
  };

  const renameGroup = (oldName, newName) => {
    let tmp = graphTree;
    const values = tmp.tree[oldName];
    delete tmp.tree[oldName];
    tmp.tree[newName] = values;
    tmp.groupTabKey = newName;
    setGraphTree({...tmp});
  };

  const renameSubGroup = (oldName, newName) => {
    let tmp = graphTree;
    const values = tmp.tree[graphTree.groupTabKey][oldName];
    delete tmp.tree[graphTree.groupTabKey][oldName];
    tmp.tree[graphTree.groupTabKey][newName] = values;
    tmp.subGroupTabKey = newName;
    setGraphTree({...tmp});
  };

  const renameYValueName = (oldName, newName) => {
    let tmp = graphTree;

    const values = tmp.tree[graphTree.groupTabKey][graphTree.subGroupTabKey][oldName];
    delete tmp.tree[graphTree.groupTabKey][graphTree.subGroupTabKey][oldName];
    tmp.tree[graphTree.groupTabKey][graphTree.subGroupTabKey][newName] = values;

    setGraphTree({...tmp});
  };

  const renameScript = (newName) => {
    let tmp = graphTree;
    tmp.script.name = newName;
    setGraphTree({...tmp});
  };

  const getLabelTransformOfGroup = (groupName) => {
    for (const group of graphTree.script.keys.group) {
      if (group.yValueGroup === groupName) {
        return group.labelTransform === "None" ? "" : group.labelTransform;
      }
    }
    return "";
  };

  const setLabelTransformOfGroup = (groupName, newTransform) => {
    let tmp = graphTree;
    tmp.script.keys.group.map(elem => {
      if (elem.yValueGroup === groupName) {
        elem.labelTransform = newTransform;
      }
      return elem;
    });
    setGraphTree({...tmp});
  };

  const collectGraphData = (data) => {
    let graphData = [];
    for (const key in data) {
      const graph = [];
      for (const v of data[key]) {
        graph.push({x: new Date(v.x), y: v.y});
      }
      graphData.push({
        name: key,
        data: graph
      });
    }
    return graphData;
  };

  const publishGraphs = () => {
    api(fetchApi, putScript, graphTree.script).then((r) => {
      if (isStatusCodeSuccessful(r.status.code)) {
        setDatasets({
          ...datasets,
          ...graphTree.tree
        });
        alertSuccess(alertStore, "All set and done!", () => setEditingDataSource(false));
      }
    });
  };

  const DeleteItem = (props) => {
    return (
      <DangerColorSpan onClick={(e) => props.callback(e, props.elem)}>
        <i className="fas fa-minus-circle"/>
      </DangerColorSpan>
    )
  };

  const groupMenuHandler = (e) => {
    return (
      <Flex>
        <div>
          <Flex>
            <div>
              <Dropdown>
                <Dropdown.Toggle variant="success" size={"sm"}>
                  {getLabelTransformOfGroup(e)}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setLabelTransformOfGroup(e, "None")}>Not specified</Dropdown.Item>
                  <Dropdown.Item onClick={() => setLabelTransformOfGroup(e, "Country")}>Country</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <Mx1/>
            <div><b>
              <LabelWithRename
                defaultValue={e}
                updater={(newValue) => renameGroup(e, newValue)}
              /></b>
            </div>
          </Flex>
        </div>
        <div>
          <DeleteItem elem={e} callback={onDeleteGroup}/>
        </div>
      </Flex>
    )
  };

  const hasData = arrayExistsNotEmptyOnObject(graphTree, "tree") && isEditingDataSource;

  const scriptHeader = (
    <Fragment>
      <Row>
        <Col>
          <Flex>
            <div>
              <Button variant={"success"}
                      onClick={() => publishGraphs()}>
                Publish
              </Button>
            </div>
            <div>
              <ButtonDiv onClick={() => setEditingDataSource(false).then()}>
                <b><i className="fas fa-times"/></b>
              </ButtonDiv>
            </div>
          </Flex>
        </Col>
      </Row>
      <RowSeparator/>
      <Row>
        <Col sm={2}>
          <SecondaryAltColorTextSpanBold>Name:</SecondaryAltColorTextSpanBold>
        </Col>
        <Col sm={10}>
          <LabelWithRename
            defaultValue={isEditingDataSource && graphTree.script.name}
            updater={(newValue) => renameScript(newValue)}
          />
        </Col>
      </Row>
      <RowSeparator/>
      <Row>
        <Col sm={2}>
          <SecondaryAltColorTextSpanBold>Source:</SecondaryAltColorTextSpanBold>
        </Col>
        <Col sm={10}>
          <LightTextSpan>
            {isEditingDataSource && graphTree.script.sourceDocument}
          </LightTextSpan>
        </Col>
      </Row>
    </Fragment>
  );

  return (
    <Fragment>
      {isEditingDataSource &&
      <ScriptResultContainer>
        <Container fluid>
          {scriptHeader}
          <RowSeparatorDouble/>
          {hasData &&
          <Fragment>
            <Row>
              <Col>
                <ScriptKeyContainerTitle>
                  Groups
                </ScriptKeyContainerTitle>
                <ScriptElementsContainer>
                  <FlexVertical>
                    {Object.keys(graphTree.tree).map(elem =>
                      (<ScriptKeyContainer key={elem}
                                           selected={elem === graphTree.groupTabKey}
                                           onClick={e => setGroupKey(e, elem)}>
                        {groupMenuHandler(elem)}
                      </ScriptKeyContainer>)
                    )}
                  </FlexVertical>
                </ScriptElementsContainer>
              </Col>
              <Col>
                <ScriptKeyContainerTitle>
                  Sub Groups
                </ScriptKeyContainerTitle>
                <ScriptElementsContainer>
                  <FlexVertical>
                    {Object.keys(graphTree.tree[graphTree.groupTabKey]).map(elem =>
                      (<ScriptKeyContainer key={elem}
                                           selected={elem === graphTree.subGroupTabKey}
                                           onClick={(e) => setSubGroupKey(e, elem)}>
                        <Flex>
                          <div>
                            <b>
                              <LabelWithRename
                                defaultValue={elem}
                                updater={(newValue) => renameSubGroup(elem, newValue)}
                              />
                            </b>
                          </div>
                          <DeleteItem elem={elem} callback={onDeleteSubGroup}/>
                        </Flex>
                      </ScriptKeyContainer>)
                    )}
                  </FlexVertical>
                </ScriptElementsContainer>
              </Col>
              <Col>
                <ScriptKeyContainerTitle>
                  Values
                </ScriptKeyContainerTitle>
                <ScriptElementsContainer>
                  <FlexVertical>
                    {Object.keys(graphTree.tree[graphTree.groupTabKey][graphTree.subGroupTabKey]).map(elem =>
                      (<ScriptKeyContainer key={elem} variant={"light"}>
                        <Flex>
                          <div>
                            <b>
                              <LabelWithRename
                                defaultValue={elem}
                                updater={(newValue) => renameYValueName(elem, newValue)}
                              />
                            </b>
                          </div>
                          <DeleteItem elem={elem} callback={onDeleteEntity}/>
                        </Flex>
                      </ScriptKeyContainer>)
                    )}
                  </FlexVertical>
                </ScriptElementsContainer>
              </Col>
            </Row>
            <Row>
              <Col>
                {
                  <GraphXY graphData={collectGraphData(graphTree.tree[graphTree.groupTabKey][graphTree.subGroupTabKey])}
                           config={
                             {
                               title: graphTree.subGroupTabKey
                             }
                           }
                  />
                }
              </Col>
            </Row>
          </Fragment>
          }
        </Container>
      </ScriptResultContainer>
      }
    </Fragment>
  );
};
