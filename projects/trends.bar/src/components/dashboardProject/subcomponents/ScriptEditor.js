import React from "reactn";
import {Fragment, useState} from "react";
import {Button, Col, Container, Form, InputGroup, Row, Table} from "react-bootstrap";
import {FormGroupBorder} from "./GatherEditor-styled";
import {api, useApi} from "../../../futuremodules/api/apiEntryPoint";
import {getCSVGraphKeys} from "../../../futuremodules/fetch/fetchApiCalls";

export const ScriptEditor = () => {

  const [formData, setFromData] = useState({});
  const fetchApi = useApi('fetch');
  const csvKeyNumberValues = fetchApi[0];

  const onChange = e => {
    setFromData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const onSubmit = e => {
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

  // const formLabelLabel = (ls, vs, label, key, placeholder = "", required = false, defaultValue = null) => (
  //   <Fragment key={key}>
  //     <Form.Label column sm={ls}>
  //       {key}
  //     </Form.Label>
  //     <Col sm={vs}>
  //       <Form.Control plaintext readOnly column sm={vs} className={"text-white font-weight-bold"} defaultValue={label}/>
  //     </Col>
  //   </Fragment>
  // );

  // const formGroupEntry = (ls, vs, label, key, placeholder = "", required = false, defaultValue = null) => (
  //   <Form.Group as={Row}>
  //     {formLabelInputEntry(ls, vs, label, key, placeholder, required, defaultValue)}
  //   </Form.Group>
  // );

  // const dataSequence = formGroupEntry(2, 10, "Sequence", "dataSequence", "", true, "Cumulative");

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
                  <tr>
                    <th>
                    CSV field
                    </th>
                    <th>
                    Show as
                    </th>
                    <th>
                    Remove
                    </th>
                  </tr>
                </thead>
                <tbody>
                {csvKeyNumberValues[elemKey].map(elem => (
                  <tr>
                    <td>{elem}</td>
                    <td>{elem}</td>
                    <td><i className={"fas fa-minus-circle"}/></td>
                  </tr>
                ))}
                </tbody>
              </Table>
          </div>
        </FormGroupBorder>
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
            {formCSVKeyElements("group", "Group By")}
            {formCSVKeyElements("x", "Timeline Axis")}
            {formCSVKeyElements("y", "Value Axis")}
            <br/>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  )
};
