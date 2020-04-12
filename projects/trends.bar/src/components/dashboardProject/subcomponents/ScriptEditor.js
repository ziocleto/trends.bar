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
import {getCSVGraphKeys} from "../../../futuremodules/fetch/fetchApiCalls";
import {
  DangerColorSpan,
  Flex,
  FlexVertical,
  LightColorTextSpanBold
} from "../../../futuremodules/reactComponentStyles/reactCommon.styled";
import {useTrendIdGetter} from "../../../modules/trends/globals";
import {arrayObjectExistsNotEmpty} from "../../../futuremodules/utils/utils";
import {getDefaultWidgetContent} from "../../../modules/trends/layout";
import {GraphXY} from "../../../futuremodules/graphs/GraphXY";
import {alertSuccess, useAlert} from "../../../futuremodules/alerts/alerts";
import {useMutation} from "@apollo/react-hooks";
import {UPSERT_TREND_GRAPH} from "../../../modules/trends/mutations";
import {graphArrayToGraphTree} from "../../../modules/trends/dataGraphs";
import {object} from "@amcharts/amcharts4/core";
import {has} from "@amcharts/amcharts4/.internal/core/utils/Array";

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
    if ( !arrayObjectExistsNotEmpty(gt.tree) ) {
      hasOne = false;
    }
    if ( hasOne ) {
      for ( const elem of Object.keys(gt.tree) ) {
        if ( arrayObjectExistsNotEmpty(gt.tree[elem]) ) {
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
        <div>
          <LightColorTextSpanBold>{e}</LightColorTextSpanBold>
        </div>
        <div>
          <DeleteItem elem={e} callback={onDeleteGroup}/>
        </div>
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
                          <div><b>{elem}</b></div>
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
                          <div><b>{elem.yValueName}</b></div>
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
                {<GraphXY data={graphTree.tree[graphTree.groupTabKey][graphTree.subGroupTabKey]}
                          config={getDefaultWidgetContent("graphxy", 0)}/>}
              </Col>
            </Row>
          </Container>
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
