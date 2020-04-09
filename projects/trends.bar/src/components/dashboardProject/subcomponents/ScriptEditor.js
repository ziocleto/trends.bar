import React from "reactn";
import {Fragment, useEffect, useState} from "react";
import {Button, Col, Container, Dropdown, Form, InputGroup, Row, Tab, Table, Tabs} from "react-bootstrap";
import {
  DangerColorSpan,
  DangerColorTd,
  FormGroupBorder,
  GroupTransform,
  ScriptGraphContainer
} from "./GatherEditor-styled";
import {api, useApi} from "../../../futuremodules/api/apiEntryPoint";
import {getCSVGraphKeys} from "../../../futuremodules/fetch/fetchApiCalls";
import {LightColorTextSpanBold} from "../../../futuremodules/reactComponentStyles/reactCommon.styled";
import {useTrendIdGetter} from "../../../modules/trends/globals";
import {GraphXY} from "../../../futuremodules/graphs/GraphXY";
import {arrayExistsNotEmptyOn} from "../../../futuremodules/utils/utils";
import {getDefaultWidgetContent} from "../../../modules/trends/layout";


const getLabelTransformOfGroup = (scriptJson, groupName) => {
  if (!scriptJson) return "None";
  for (const group of scriptJson.groups) {
    if (group.label === groupName) {
      return group.labelTransform;
    }
  }
  return "None";
};

export const ScriptEditor = () => {

  const trendId = useTrendIdGetter();
  const [formData, setFromData] = useState({});
  const [groupTabKey, setGroupTabKey] = useState(null);
  const fetchApi = useApi('fetch');
  const [fetchResult, setFetchResult] = fetchApi;

  useEffect(() => {
    if (fetchResult) {
      console.log(fetchResult);
      if (arrayExistsNotEmptyOn(fetchResult, "groupsSetArray")) setGroupTabKey(fetchResult.groupsSetArray[0]);
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
    setFetchResult({
        ...fetchResult,
        groupsSetArray: fetchResult.groupsSetArray.filter(e => e !== elem)
      }
    );
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
        <th>Name</th>
        <th>X Axis</th>
        <th>Y Axis</th>
        <th>Remove</th>
      </tr>
    )
  };

  const csvScriptTD = (e) => {
    let ret = [];
    for (const elem of fetchResult.script.groups) {
      if (elem.label === e) {
        ret.push((
          <tr key={elem.key}>
            <td><b>{elem.key}</b></td>
            <td><b>{elem.x}</b></td>
            <td><b>{elem.y}</b></td>
            <DeleteCSVElem elem={elem}/>
          </tr>
        ));
      }
    }
    return ret.map(re => re);
  };

  const scriptOutputTables = () => {
    let ret = (<Fragment/>);
    if (arrayExistsNotEmptyOn(fetchResult, "groupsSetArray")) {
      ret = (
        <Tabs id={"tid"} variant="pills" activeKey={groupTabKey} onSelect={k => setGroupTabKey(k)}>
          {fetchResult.groupsSetArray.map(e => {
            return (
              <Tab key={e} eventKey={e} title={<LightColorTextSpanBold>{e}</LightColorTextSpanBold>}>
                <FormGroupBorder>
                  <br/>
                  <GroupTransform>
                    <div>Group:{" "}
                      <LightColorTextSpanBold>{e}</LightColorTextSpanBold>
                    </div>
                    <Dropdown>
                      Group Transform:{" "}
                      <Dropdown.Toggle variant="success" size={"sm"}>
                        {getLabelTransformOfGroup(fetchResult.script, e)}
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item>None</Dropdown.Item>
                        <Dropdown.Item>Country</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                    <div>Remove group <DeleteCSVGroup elem={e}/></div>
                  </GroupTransform>
                  <br/>
                  <Table striped bordered hover variant="dark" size="sm">
                    <thead>
                    {csvScriptHead()}
                    </thead>
                    <tbody>
                    {csvScriptTD(e)}
                    </tbody>
                  </Table>
                  <ScriptGraphContainer>
                    <GraphXY data={fetchResult.groupQuerySet[e]} config={getDefaultWidgetContent("graphxy", 0)}/>
                  </ScriptGraphContainer>
                </FormGroupBorder>
              </Tab>
            )
          })}
        </Tabs>
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
