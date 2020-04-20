import React from "reactn";
import "./DataSources.css"
import {Fragment, useState} from "react";
import {checkURLValid} from "../../../../futuremodules/utils/utils";
import {Button, Col, Form, InputGroup, Row} from "react-bootstrap";
import {PlusTitle, RowSeparator} from "../../../../futuremodules/reactComponentStyles/reactCommon";
import {useGatherSource} from "./DataSourcesCreatorLogic";

export const DataSourcesCreator = ({trendId}) => {

  const [sourceDocument, setSourceDocument] = useState(null);
  const gatherSource = useGatherSource(trendId);

  return (
    <Fragment>
      <Row>
        <Col>
          <PlusTitle text={"Create new Source"}/>
        </Col>
      </Row>
      <RowSeparator/>
      <Row>
        <Col>
          <InputGroup className="mb-1">
            <Form.Control name={"sourceDocument"} placeholder={"Url of your source here"}
                          onChange={e => setSourceDocument(e.target.value)} required={true}/>
            <InputGroup.Append>
              <Button variant="info" disabled={!checkURLValid(sourceDocument)}
                      onClick={(e) => gatherSource(sourceDocument)}>Create</Button>
            </InputGroup.Append>
          </InputGroup>
        </Col>
      </Row>
    </Fragment>
  );
};
