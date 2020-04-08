import React from "reactn";
import {Fragment, useEffect, useState} from "react";
import {Button, Col, Container, Dropdown, Form, InputGroup, Row, Tab, Table, Tabs} from "react-bootstrap";
import {DangerColorDiv, DangerColorTd, FormGroupBorder, GroupTransform} from "./GatherEditor-styled";
import {api, useApi} from "../../../futuremodules/api/apiEntryPoint";
import {getCSVGraphKeys} from "../../../futuremodules/fetch/fetchApiCalls";
import {LightColorTextSpanBold} from "../../../futuremodules/reactComponentStyles/reactCommon.styled";

export const ScriptEditor = () => {

  const [formData, setFromData] = useState({});
  const [scriptJson, setScriptJson] = useState(null);
  const fetchApi = useApi('fetch');
  const csvKeyNumberValues = fetchApi[0];

  console.log(scriptJson);

  useEffect(() => {
    if (csvKeyNumberValues) {
      let sj = {};
      sj["source"] = formData.source;
      sj["groups"] = [];
      for (const group of csvKeyNumberValues["group"]) {
        for (const elem of csvKeyNumberValues["y"]) {
          sj["groups"].push({
            label: group,
            labelTransform: "",
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

  const onSubmit = e => {
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

  const middleHeadPart = (key) => {
    if (key === "group") {
      return (
        <Fragment>
          <th>
            As
          </th>
          <th>
            Transform
          </th>
        </Fragment>
      )
    } else {
      return (
        <Fragment>
          <th>
            As
          </th>
        </Fragment>
      )
    }
  };

  const csvHeadFor = (key) => {
    const middle = middleHeadPart(key);
    return (
      <tr>
        <th>
          CSV field
        </th>
        {middle}
        <th>
          Remove
        </th>
      </tr>
    )
  };

  const DeleteCSVElem = (props) => {
    return (
      <DangerColorTd onClick={() => onDeleteEntity(props.elem)}>
        <i className="fas fa-minus-circle"/>
      </DangerColorTd>
    )
  };

  const DeleteCSVGroup = (props) => {
    return (
      <DangerColorDiv onClick={() => onDeleteGroup(props.elem)}>
        <i className="fas fa-minus-circle"/>
      </DangerColorDiv>
    )
  };

  const csvTdFor = (key, elem) => {
    if (key === "group") {
      return (
        <tr key={elem}>
          <td>{elem}</td>
          <td><b>{elem}</b></td>
          <td>
            <Dropdown>
              <Dropdown.Toggle variant="success" size={"sm"}>
                None
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item>None</Dropdown.Item>
                <Dropdown.Item>Country</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </td>
          <DeleteCSVElem keyV={key} elem={elem}/>
        </tr>
      )
    } else {
      return (
        <tr key={elem}>
          <td>{elem}</td>
          <td><b>{elem}</b></td>
          <DeleteCSVElem keyV={key} elem={elem}/>
        </tr>
      )
    }
  };

  const formCSVKeyElements = (elemKey, title) => {
    let ret = (<Fragment/>);
    if (csvKeyNumberValues && csvKeyNumberValues[elemKey]) {
      ret = (
        <FormGroupBorder>
          <div>
            <h4><b>{title}</b></h4>
          </div>
          <div>
            <Table striped bordered hover variant="dark" size="sm">
              <thead>
              {csvHeadFor(elemKey)}
              </thead>
              <tbody>
              {csvKeyNumberValues[elemKey].map(elem => (
                csvTdFor(elemKey, elem)
              ))}
              </tbody>
            </Table>
          </div>
        </FormGroupBorder>
      )
    }
    return ret;
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
                        None
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item>None</Dropdown.Item>
                        <Dropdown.Item>Country</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                    <DeleteCSVGroup elem={e}/>
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
          <Form onSubmit={(ev) => onSubmit(ev)}>
            <Form.Group as={Row}>
              {formLabelInputSubmitEntry(2, 10, "Source", "source", "Url of your source here", true)}
            </Form.Group>
            {scriptOutputTables()}
            {/*{formCSVKeyElements("group", "Group By")}*/}
            {/*{formCSVKeyElements("x", "Timeline Axis")}*/}
            {/*{formCSVKeyElements("y", "Value Axis")}*/}
            <br/>
            <Button variant="success">
              Submit
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  )
};
