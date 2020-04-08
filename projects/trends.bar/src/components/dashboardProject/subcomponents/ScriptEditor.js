import React from "reactn";
import {Fragment, useEffect, useState} from "react";
import {Button, Col, Container, Dropdown, Form, InputGroup, Row, Tab, Table, Tabs} from "react-bootstrap";
import {DangerColorSpan, DangerColorTd, FormGroupBorder, GroupTransform} from "./GatherEditor-styled";
import {api, useApi} from "../../../futuremodules/api/apiEntryPoint";
import {getCSVGraphKeys} from "../../../futuremodules/fetch/fetchApiCalls";
import {LightColorTextSpanBold} from "../../../futuremodules/reactComponentStyles/reactCommon.styled";

const getDefaultLabelTransformOf = (group) => {
  if ( group.toLowerCase().includes("country") ) {
    return "Country";
  }
  return "None";
};

const getLabelTransformOfGroup = (scriptJson, groupName) => {
  if ( !scriptJson ) return "None";
  for ( const group of scriptJson.groups ) {
    if (group.label === groupName) {
      return group.labelTransform;
    }
  }
  return "None";
};

export const ScriptEditor = () => {

  const [formData, setFromData] = useState({});
  const [scriptJson, setScriptJson] = useState(null);
  const fetchApi = useApi('fetch');
  const csvKeyNumberValues = fetchApi[0];

  console.log(scriptJson);

  useEffect(() => {
    if (csvKeyNumberValues) {
      console.log(csvKeyNumberValues);
      let sj = {};
      sj["source"] = formData.source;
      sj["groups"] = [];
      for (const group of csvKeyNumberValues["group"]) {
        for (const elem of csvKeyNumberValues["y"]) {
          sj["groups"].push({
            label: group,
            labelTransform: getDefaultLabelTransformOf(group),
            key: elem,
            x: csvKeyNumberValues["x"][0],
            y: elem
          });
        }
      }
      console.log(sj);
      setScriptJson(sj);
    }
  }, [csvKeyNumberValues, formData.source]);

  const onChange = e => {
    setFromData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const onDeleteEntity = (elem) => {
    setScriptJson(s => {
        return {
          ...s,
          groups: scriptJson.groups.filter(e => e !== elem)
        }
      }
    );
  };

  const onDeleteGroup = (elem) => {
    setScriptJson(s => {
        return {
          ...s,
          groups: scriptJson.groups.filter(e => e.label !== elem)
        }
      }
    );
  };

  const gatherSource = () => {
    api(fetchApi, getCSVGraphKeys, formData.source).then();
  };

  // const formLabelInputEntry = (ls, vs, label, key, placeholder = "", required = false, defaultValue = null) => (
  //   <Fragment>
  //     <Form.Label column sm={ls} className={"text-white font-weight-bold"}>
  //       {label}
  //     </Form.Label>
  //     <Col sm={vs}>
  //       <Form.Control name={key} placeholder={placeholder} defaultValue={defaultValue}
  //                     onChange={e => onChange(e)} required={required}/>
  //     </Col>
  //   </Fragment>
  // );

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
    for (const elem of scriptJson.groups) {
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
    if (scriptJson && scriptJson.groups && scriptJson.groups.length > 0) {
      let tabSet = new Set();
      let tabArray = [];
      scriptJson.groups.map(elem => tabSet.add(elem.label));
      tabSet.forEach(e => tabArray.push(e));
      ret = (
        <Tabs id={"tid"} variant="pills">
          {tabArray.map(e => {
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
                        {getLabelTransformOfGroup(scriptJson, e)}
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
        <Col sm={12}>
          <Form>
            <Form.Group as={Row}>
              {formLabelInputSubmitEntry(2, 10, "Source", "source", "Url of your source here", true)}
            </Form.Group>
            {scriptOutputTables()}
            <br/>
          </Form>
        </Col>
      </Row>
    </Container>
  )
};
