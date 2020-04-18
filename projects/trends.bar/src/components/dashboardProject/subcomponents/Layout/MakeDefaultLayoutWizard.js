import React, {Fragment} from "reactn";
import Modal from "react-bootstrap/Modal";
import {Col, Container, Row} from "react-bootstrap";
import {H2} from "../../../Trend/TrendPageStyle";
import {LightColorTextSpan} from "../../../../futuremodules/reactComponentStyles/reactCommon.styled";

export const MakeDefaultLayoutWizard = ({datasets, layout, setLayout, setDatasets}) => {

  return (
    <Fragment>
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={true}
        // onHide={() => onClose()}
      >
        <Modal.Body>
          <Container>
            <Row>
              <H2>
                Choose a Layout
              </H2>
            </Row>
            <Row>
              <LightColorTextSpan>
              (Don't worry you can re-shape it later, promise!)
              </LightColorTextSpan>
            </Row>
            <Row>
              <Col>
                1
              </Col>
              <Col>
                1
              </Col>
              <Col>
                1
              </Col>
              <Col>
                1
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
      </Modal>
    </Fragment>
  )
};
