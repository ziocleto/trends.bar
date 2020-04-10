import React from "reactn";
import {Fragment, useEffect, useState} from "react";
import {Button, Col, Container, Dropdown, Form, InputGroup, Nav, Row, Tab, Table, Tabs} from "react-bootstrap";
import {DangerColorSpan, DangerColorTd, ScriptGraphContainer, ScriptResultContainer} from "./GatherEditor-styled";
import {api, useApi} from "../../../futuremodules/api/apiEntryPoint";
import {getCSVGraphKeys} from "../../../futuremodules/fetch/fetchApiCalls";
import {
  Flex,
  LightColorTextSpanBold,
  MarginBorderDiv, Mx1
} from "../../../futuremodules/reactComponentStyles/reactCommon.styled";
import {useTrendIdGetter} from "../../../modules/trends/globals";
import {arrayExistsNotEmptyOnObject, arrayObjectExistsNotEmpty} from "../../../futuremodules/utils/utils";
import {getDefaultWidgetContent} from "../../../modules/trends/layout";
import {GraphXY} from "../../../futuremodules/graphs/GraphXY";
import {alertSuccess, useAlert} from "../../../futuremodules/alerts/alerts";
import {useMutation} from "@apollo/react-hooks";
import {UPSERT_TREND_GRAPH} from "../../../modules/trends/mutations";


const getLabelTransformOfGroup = (scriptJson, groupName) => {
  if (!scriptJson) return "";
  for (const group of scriptJson.groups) {
    if (group.label === groupName) {
      return group.labelTransform === "None" ? "" : group.labelTransform;
    }
  }
  return "";
};

export const ScriptEditor = () => {

    const trendId = useTrendIdGetter();
    const [formData, setFromData] = useState({});
    const [groupTabKey, setGroupTabKey] = useState(null);
    const [subGroupTabKey, setSubGroupTabKey] = useState(null);
    const fetchApi = useApi('fetch');
    const [fetchResult, setFetchResult] = fetchApi;
    const alertStore = useAlert();
    const [upsertTrendGraph] = useMutation(UPSERT_TREND_GRAPH);

    useEffect(() => {
      if (fetchResult) {
        console.log(fetchResult);
        if (arrayObjectExistsNotEmpty(fetchResult.groupQuerySet)) {
          const groupKey = Object.keys(fetchResult.groupQuerySet)[0];
          setGroupTabKey(groupKey);
          if (arrayObjectExistsNotEmpty(fetchResult.groupQuerySet[groupKey])) {
            setSubGroupTabKey(Object.keys(fetchResult.groupQuerySet[groupKey])[0]);
          }
        }
      }
    }, [fetchResult]);

    const onChange = e => {
      setFromData({
        ...formData,
        [e.target.name]: e.target.value
      });
    };

    const onDeleteEntity = (elem) => {
      setFetchResult({
          ...fetchResult,
          script: {
            ...fetchResult.script,
            groups: fetchResult.script.groups.filter(e => e !== elem)
          }
        }
      );
    };

    const onDeleteGroup = (elem) => {
      let tmp = fetchResult.groupQuerySet;
      delete tmp[elem];
      setFetchResult({
          ...fetchResult,
          groupQuerySet: tmp
        }
      );
    };

    const gatherAllGraphs = () => {
      const ret = [];
      for (const group of Object.keys(fetchResult.groupQuerySet)) {
        for (const subGroup of Object.keys(fetchResult.groupQuerySet[group])) {
          for ( const graph of fetchResult.groupQuerySet[group][subGroup] ){
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
        <DangerColorTd onClick={() => onDeleteEntity(props.elem)}>
          <i className="fas fa-minus-circle"/>
        </DangerColorTd>
      )
    };

    const DeleteCSVGroup = (props) => {
      return (
        <DangerColorSpan onClick={() => onDeleteGroup(props.elem)}>
          <i className="fas fa-minus-circle"/>
        </DangerColorSpan>
      )
    };

    const csvScriptHead = () => {
      return (
        <tr>
          <th>Value</th>
          <th>Remove</th>
        </tr>
      )
    };

    const csvScriptTD = (e, key) => {
      let ret = [];
      for (const elem of fetchResult.groupQuerySet[e][key]) {
        const uk = e + key;
        ret.push((
          <tr key={uk + elem.title}>
            <td><b>{elem.title}</b></td>
            <DeleteCSVElem elem={elem}/>
          </tr>
        ));
      }
      return ret.map(re => re);
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

    const groupItemsNavKeys = (e) => {
      const keys = Object.keys(fetchResult.groupQuerySet[e]);
      return (
        keys.map(key => (<Nav.Item key={key}>
            <Nav.Link eventKey={key}>{key}</Nav.Link>
          </Nav.Item>
        ))
      );
    };

    const groupItemsPanelsGroupKeys = (e) => {
      const keys = Object.keys(fetchResult.groupQuerySet[e]);
      return (
        keys.map(key => (
          <Tab.Content key={key}>
            <Tab.Pane eventKey={key}>
              {key === subGroupTabKey &&
              <div>
                <Table striped bordered hover variant="dark" size="sm">
                  <thead>
                  {csvScriptHead()}
                  </thead>
                  <tbody>
                  {csvScriptTD(e, key)}
                  </tbody>
                </Table>
                <ScriptGraphContainer>
                  <GraphXY data={fetchResult.groupQuerySet[e][key]} config={getDefaultWidgetContent("graphxy", 0)}/>
                </ScriptGraphContainer>
              </div>
              }
            </Tab.Pane>
          </Tab.Content>
        ))
      );
    };

    const scriptOutputTables = () => {
      let ret = (<Fragment/>);
      if (arrayExistsNotEmptyOnObject(fetchResult, "groupQuerySet")) {
        ret = (
          <ScriptResultContainer>
            <Tabs id={"tid"} variant="pills" activeKey={groupTabKey} onSelect={k => setGroupTabKey(k)}>
              {Object.keys(fetchResult.groupQuerySet).map(e => {
                return (
                  <Tab key={e} eventKey={e} title={groupMenuHandler(e)}>
                    {e === groupTabKey &&
                    <MarginBorderDiv>
                      <Tab.Container activeKey={subGroupTabKey} onSelect={k => setSubGroupTabKey(k)}>
                        <Row>
                          <Col sm={2}>
                            <Nav variant="pills" className="flex-column">
                              {groupItemsNavKeys(e)}
                            </Nav>
                          </Col>
                          <Col sm={10}>
                            {groupItemsPanelsGroupKeys(e)}
                          </Col>
                        </Row>
                      </Tab.Container>
                    </MarginBorderDiv>
                    }
                  </Tab>
                )
              })}
            </Tabs>
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
  }
;
