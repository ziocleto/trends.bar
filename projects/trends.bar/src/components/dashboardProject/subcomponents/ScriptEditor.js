import React from "reactn";
import {Fragment, useEffect, useState} from "react";
import {Button, Col, Container, Dropdown, Form, InputGroup, ListGroup, Nav, Row, Tab, Table} from "react-bootstrap";
import {ScriptElementsContainer, ScriptGraphContainer, ScriptResultContainer} from "./GatherEditor-styled";
import {api, useApi} from "../../../futuremodules/api/apiEntryPoint";
import {getCSVGraphKeys} from "../../../futuremodules/fetch/fetchApiCalls";
import {
  DangerColorDiv,
  DangerColorSpan,
  DangerColorTd,
  Flex,
  LightColorTextSpanBold,
  Mx1
} from "../../../futuremodules/reactComponentStyles/reactCommon.styled";
import {useTrendIdGetter} from "../../../modules/trends/globals";
import {arrayObjectExistsNotEmpty} from "../../../futuremodules/utils/utils";
import {getDefaultWidgetContent} from "../../../modules/trends/layout";
import {GraphXY} from "../../../futuremodules/graphs/GraphXY";
import {alertSuccess, useAlert} from "../../../futuremodules/alerts/alerts";
import {useMutation} from "@apollo/react-hooks";
import {UPSERT_TREND_GRAPH} from "../../../modules/trends/mutations";
import {graphArrayToGraphTree} from "../../../modules/trends/dataGraphs";

const getLabelTransformOfGroup = (scriptJson, groupName) => {
  if (!scriptJson) return "";
  for (const group of scriptJson.groups) {
    if (group.yValueSubGroup === groupName) {
      return group.labelTransform === "None" ? "" : group.labelTransform;
    }
  }
  return "";
};

export const ScriptEditor = () => {

  const trendId = useTrendIdGetter();
  const [formData, setFromData] = useState({});
  const [graphTree, setGraphTree] = useState(null);
  const fetchApi = useApi('fetch');
  const [fetchResult] = fetchApi;
  const alertStore = useAlert();
  const [upsertTrendGraph] = useMutation(UPSERT_TREND_GRAPH);

  useEffect(() => {
    if (fetchResult) {
      const gt = graphArrayToGraphTree(fetchResult.graphQueries, "yValueGroup", "yValueSubGroup");
      setCompositeGraphTree(gt);
    }
  }, [fetchResult]);

  const setCompositeGraphTree = (gt) => {
    const groupTabKey = Object.keys(gt)[0];
    let subGroupTabKey = null;
    if (arrayObjectExistsNotEmpty(gt[groupTabKey])) {
      subGroupTabKey = Object.keys(gt[groupTabKey])[0];
    }

    setGraphTree( {
      tree: gt,
      groupTabKey: groupTabKey,
      subGroupTabKey: subGroupTabKey
    });
  };

  const onChange = e => {
    setFromData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const checkDeleteItemGroup = (tmp) => {
    if ( Object.keys(tmp[graphTree.groupTabKey]).length === 0  ) {
      delete tmp[graphTree.groupTabKey];
    }
  };

  const checkDeleteSubGroup = (tmp) => {
    if ( Object.keys( tmp[graphTree.groupTabKey][graphTree.subGroupTabKey]).length === 0  ) {
      delete  tmp[graphTree.groupTabKey][graphTree.subGroupTabKey];
      checkDeleteItemGroup(tmp);
    }
  };

  const onDeleteEntity = (elem) => {
    let tmp = graphTree.tree;
    tmp[graphTree.groupTabKey][graphTree.subGroupTabKey] = tmp[graphTree.groupTabKey][graphTree.subGroupTabKey].filter(e => e.yValueName !== elem);
    checkDeleteSubGroup(tmp);
    setCompositeGraphTree(tmp);
  };

  const onDeleteSubGroup = (elem) => {
    let tmp = graphTree.tree;
    delete tmp[graphTree.groupTabKey][elem];
    checkDeleteItemGroup(tmp);
    setCompositeGraphTree(tmp);
  };

  const onDeleteGroup = (elem) => {
    let tmp = graphTree.tree;
    delete tmp[elem];
    setCompositeGraphTree(tmp);
  };

  const gatherAllGraphs = () => {
    const ret = [];
    for (const group of Object.keys(fetchResult.groupQuerySet)) {
      for (const subGroup of Object.keys(fetchResult.groupQuerySet[group])) {
        for (const graph of fetchResult.groupQuerySet[group][subGroup]) {
          ret.push(graph);
        }
      }
    }
    return ret;
  };

  const publishGraphs = () => {
    upsertTrendGraph({
      variables: {
        graphQueries: gatherAllGraphs()
      }
    }).then(() =>
      alertSuccess(alertStore, "All set and done!")
    ).catch((e) => {
      console.log("Uacci uari uari", e);
    });
  };

  const gatherSource = () => {
    api(fetchApi, getCSVGraphKeys, {url: formData.sourceDocument, trendId}).then();
  };

  const formLabelInputSubmitEntry = (ls, vs, label, key, placeholder = "", required = false, defaultValue = null) => (
    <Fragment key={key}>
      <Form.Label column sm={ls} className={"text-white font-weight-bold"}>
        {label}
      </Form.Label>
      <Col sm={vs}>
        <InputGroup className="mb-1">
          <Form.Control name={key} placeholder={placeholder} defaultValue={defaultValue}
                        onChange={e => onChange(e)} required={required}/>
          <InputGroup.Append>
            <Button variant="info" onClick={() => gatherSource()}>Gather</Button>
          </InputGroup.Append>
        </InputGroup>
      </Col>
    </Fragment>
  );

  const DeleteCSVElem = (props) => {
    return (
      <DangerColorSpan onClick={() => onDeleteEntity(props.elem)}>
        <i className="fas fa-minus-circle"/>
      </DangerColorSpan>
    )
  };

  const DeleteCSVGroup = (props) => {
    return (
      <DangerColorSpan onClick={() => onDeleteGroup(props.elem)}>
        <i className="fas fa-minus-circle"/>
      </DangerColorSpan>
    )
  };

  const DeleteItem = (props) => {
    return (
      <DangerColorSpan onClick={() => props.callback(props.elem)}>
        <i className="fas fa-minus-circle"/>
      </DangerColorSpan>
    )
  };


  const groupMenuHandler = (e) => {
    return (
      <Flex>
        <Dropdown>
          <Dropdown.Toggle variant="success" size={"sm"}>
            {getLabelTransformOfGroup(fetchResult.script, e)}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item>Not specified</Dropdown.Item>
            <Dropdown.Item>Country</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Mx1/>
        <LightColorTextSpanBold>{e}</LightColorTextSpanBold>
        <Mx1/>
        <DeleteCSVGroup elem={e}/>
      </Flex>
    );
  };


  console.log(graphTree);
  const scriptOutputTables = () => {
    let ret = (<Fragment/>);
    if (graphTree && arrayObjectExistsNotEmpty(graphTree.tree)) {
      ret = (
        <ScriptResultContainer>
          <Container fluid>
            <Row>
              <Col>
                <ScriptElementsContainer>
                  <ListGroup>
                    {Object.keys(graphTree.tree).map(elem =>
                      (<ListGroup.Item key={elem}>
                        {groupMenuHandler(elem)}
                      </ListGroup.Item>)
                    )}
                  </ListGroup>
                </ScriptElementsContainer>
              </Col>
              <Col>
                <ScriptElementsContainer>
                  <ListGroup>
                    {Object.keys(graphTree.tree[graphTree.groupTabKey]).map(elem =>
                      (<ListGroup.Item key={elem}>
                        <Container>
                          <Row>
                            <Col sm={9}>
                              <div><b>{elem}</b></div>
                            </Col>
                            <Col>
                              <DeleteItem elem={elem} callback={onDeleteSubGroup}/>
                            </Col>
                          </Row>
                        </Container>
                      </ListGroup.Item>)
                    )}
                  </ListGroup>
                </ScriptElementsContainer>
              </Col>
              <Col>
                <ScriptElementsContainer>
                  <ListGroup>
                    {graphTree.tree[graphTree.groupTabKey][graphTree.subGroupTabKey].map(elem =>
                      (<ListGroup.Item key={elem.yValueName}>
                        <Container>
                          <Row>
                            <Col sm={9}>
                              <div><b>{elem.yValueName}</b></div>
                            </Col>
                            <Col>
                              <DeleteItem elem={elem.yValueName} callback={onDeleteEntity}/>
                            </Col>
                          </Row>
                        </Container>
                      </ListGroup.Item>)
                    )}
                  </ListGroup>
                </ScriptElementsContainer>
              </Col>
            </Row>
            <Row>
              <Col>
                {<GraphXY data={graphTree.tree[graphTree.groupTabKey][graphTree.subGroupTabKey]} config={getDefaultWidgetContent("graphxy", 0)}/>}
              </Col>
            </Row>
          </Container>
        </ScriptResultContainer>
        // <ScriptResultContainer>
        //   <Tabs id={"tid"} variant="pills" activeKey={groupTabKey} onSelect={k => setGroupTabKey(k)}>
        //     {Object.keys(graphTree.tree).map(e => {
        //       return (
        //         <Tab key={e} eventKey={e} title={groupMenuHandler(e)}>
        //           {e === groupTabKey &&
        //           <MarginBorderDiv>
        //             <Tab.Container activeKey={subGroupTabKey} onSelect={k => setSubGroupTabKey(k)}>
        //               <Row>
        //                 <Col sm={2}>
        //                   <Nav variant="pills" className="flex-column">
        //                     {groupItemsNavKeys(e)}
        //                   </Nav>
        //                 </Col>
        //                 <Col sm={10}>
        //                   {groupItemsPanelsGroupKeys(e)}
        //                 </Col>
        //               </Row>
        //             </Tab.Container>
        //           </MarginBorderDiv>
        //           }
        //         </Tab>
        //       )
        //     })}
        //   </Tabs>
        //   <Button variant={"success"}
        //           onClick={() => publishGraphs()}>
        //     Publish
        //   </Button>
        // </ScriptResultContainer>
      )
    }
    return ret;
  };

  return (
    <Container fluid>
      <Row>
        {formLabelInputSubmitEntry(2, 10, "Source", "sourceDocument", "Url of your source here", true)}
      </Row>
      <Row>
        <Col>
          {scriptOutputTables()}
        </Col>
      </Row>
    </Container>
  );
};
