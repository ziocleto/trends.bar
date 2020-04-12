import React from "reactn";
import {Fragment, useEffect, useState} from "react";
import {Button, Col, Container, Dropdown, Form, InputGroup, Row} from "react-bootstrap";
import {
  ScriptElementsContainer,
  ScriptKeyContainer,
  ScriptKeyContainerTitle,
  ScriptResultContainer
} from "./GatherEditor-styled";
import {api, useApi} from "../../../futuremodules/api/apiEntryPoint";
import {getCSVGraphKeys, putScript} from "../../../futuremodules/fetch/fetchApiCalls";
import {DangerColorSpan, Flex, FlexVertical, Mx1} from "../../../futuremodules/reactComponentStyles/reactCommon.styled";
import {useTrendIdGetter} from "../../../modules/trends/globals";
import {arrayObjectExistsNotEmpty} from "../../../futuremodules/utils/utils";
import {GraphXY} from "../../../futuremodules/graphs/GraphXY";
import {alertSuccess, useAlert} from "../../../futuremodules/alerts/alerts";
import {graphArrayToGraphTree} from "../../../modules/trends/dataGraphs";
import {LabelWithRename} from "../../../futuremodules/labelWithRename/LabelWithRename";

const getLabelTransformOfGroup = (scriptJson, groupName) => {
  if (!scriptJson) return "";
  for (const group of scriptJson.groups) {
    if (group.yValueGroup === groupName) {
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

  useEffect(() => {
    if (fetchResult) {
      console.log("Fetch result ", fetchResult);
      const gt = graphArrayToGraphTree(fetchResult.graphQueries, "yValueGroup", "yValueSubGroup");
      const groupTabKey = Object.keys(gt)[0];
      const subGroupTabKey = Object.keys(gt[groupTabKey])[0];
      setGraphTree({
        tree: gt,
        groupTabKey: groupTabKey,
        subGroupTabKey: subGroupTabKey
      });
    }
  }, [fetchResult]);

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

  const onChange = e => {
    setFromData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const onDeleteEntity = (e, elem) => {
    e.stopPropagation();
    let tmp = graphTree;
    tmp.tree[graphTree.groupTabKey][graphTree.subGroupTabKey] = tmp.tree[graphTree.groupTabKey][graphTree.subGroupTabKey].filter(e => e.yValueName !== elem);
    if (Object.keys(tmp.tree[graphTree.groupTabKey][graphTree.subGroupTabKey]).length === 0) {
      delete tmp.tree[graphTree.groupTabKey][graphTree.subGroupTabKey];
      setFirstSubGroupKey(tmp);
    }
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
    tmp.tree[graphTree.groupTabKey][graphTree.subGroupTabKey].map(elem => {
      if (elem.yValueName === oldName) {
        elem.yValueName = newName;
      }
      return elem;
    });
    setGraphTree({...tmp});
  };

  const publishGraphs = () => {
    api( fetchApi, putScript, fetchResult.script ).then( () => {
      alertSuccess(alertStore, "All set and done!");
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
                  {getLabelTransformOfGroup(fetchResult.script, e)}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item>Not specified</Dropdown.Item>
                  <Dropdown.Item>Country</Dropdown.Item>
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

  // console.log(graphTree);
  const scriptOutputTables = () => {
    let ret = (<Fragment/>);
    if (graphTree && arrayObjectExistsNotEmpty(graphTree.tree)) {
      ret = (
        <ScriptResultContainer>
          <Container fluid>
            <Row>
              <Col>
                <ScriptElementsContainer>
                  <FlexVertical>
                    <ScriptKeyContainerTitle>
                      Groups
                    </ScriptKeyContainerTitle>
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
                <ScriptElementsContainer>
                  <FlexVertical>
                    <ScriptKeyContainerTitle>
                      Sub Groups
                    </ScriptKeyContainerTitle>
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
                <ScriptElementsContainer>
                  <FlexVertical>
                    <ScriptKeyContainerTitle>
                      Values
                    </ScriptKeyContainerTitle>
                    {graphTree.tree[graphTree.groupTabKey][graphTree.subGroupTabKey].map(elem =>
                      (<ScriptKeyContainer key={elem.yValueName} variant={"light"}>
                        <Flex>
                          <div>
                            <b>
                              <LabelWithRename
                                defaultValue={elem.yValueName}
                                updater={(newValue) => renameYValueName(elem.yValueName, newValue)}
                              />
                            </b>
                          </div>
                          <DeleteItem elem={elem.yValueName} callback={onDeleteEntity}/>
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
                  <GraphXY data={graphTree.tree[graphTree.groupTabKey][graphTree.subGroupTabKey]}
                           config={
                             {
                               title: graphTree.subGroupTabKey
                             }
                           }
                  />
                }
              </Col>
            </Row>
          </Container>
          <br/>
          <Button variant={"success"}
                  onClick={() => publishGraphs()}>
            Publish
          </Button>
        </ScriptResultContainer>
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
