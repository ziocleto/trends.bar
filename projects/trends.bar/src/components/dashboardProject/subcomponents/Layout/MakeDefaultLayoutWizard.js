import React, {Fragment} from "reactn";
import Modal from "react-bootstrap/Modal";
import {Button, Col, Container, Row} from "react-bootstrap";
import {H2} from "../../../Trend/TrendPageStyle";
import {
  ButtonBgDiv,
  InfoTextSpan,
  LightTextSpan,
  SecondaryAltColorTextSpan
} from "../../../../futuremodules/reactComponentStyles/reactCommon.styled";
import GridLayout from "react-grid-layout";
import {DivLayoutTemplate} from "./LayoutEditor.styled";
import {RowSeparatorDoubleHR} from "../../../../futuremodules/reactComponentStyles/reactCommon";
import {useState} from "react";
import {ImportDataSources} from "../DataSources/ImportDataSources";
import {createDefaultLayouts, saveLayout} from "./MakeDefaultLayoutWizardLogic";
import {layoutStandardCols} from "../../../../modules/trends/globals";
import {DataSourceEditor} from "../DataSources/DataSourceEditor";

export const MakeDefaultLayoutWizard = ({trendId, setLayout}) => {

  const [step, setStep] = useState(1);
  const [wizardLayout, setWizardLayout] = useState(null);

  return (
    <Fragment>
      <Modal
        size="xl"
        centered
        show
      >
        <Modal.Body>
          <Container>
            <Row>
              {step === 1 && <H2>
                Choose a <SecondaryAltColorTextSpan>Layout</SecondaryAltColorTextSpan>
              </H2>
              }
              {step === 2 && <H2>
                Choose a <SecondaryAltColorTextSpan>Source</SecondaryAltColorTextSpan>
              </H2>
              }
            </Row>
            <Row>
              {step === 1 &&
              <LightTextSpan>
                Don't worry you can re-shape it as much as you'd like it later, promise!
              </LightTextSpan>}
              {step === 2 &&
              <LightTextSpan>
                Where do you want to get your trend content from?
              </LightTextSpan>}
            </Row>
            <RowSeparatorDoubleHR/>
            <Row>
              {step === 1 && createDefaultLayouts().map(layout =>
                <Col key={JSON.stringify(layout)}>
                  <ButtonBgDiv
                    borderColor={"var(--info)"}
                    backgroundColor={"var(--dark)"}
                    padding={"10px"}
                    onClick={() => saveLayout(layout, setWizardLayout, setStep)}
                  >
                    <GridLayout layout={layout}
                                cols={layoutStandardCols}
                                rowHeight={10}
                                width={200}
                    >
                      {layout.map(elem => {
                        return (
                          <DivLayoutTemplate key={elem.i}>
                          </DivLayoutTemplate>
                        );
                      })}
                    </GridLayout>
                  </ButtonBgDiv>
                </Col>
              )}
            </Row>
            {step === 2 && <DataSourceEditor layout={wizardLayout} setLayout={setWizardLayout}/>}
            {step === 2 && <ImportDataSources layout={wizardLayout} setLayout={setWizardLayout}/>}
          </Container>
        </Modal.Body>
        <Modal.Footer>
          {step === 1 && <InfoTextSpan>Step {step} of 2</InfoTextSpan>}
          {step === 2 && <Button variant={"success"} onClick={() => {
            setLayout(wizardLayout);
          }}>Done!</Button>}
        </Modal.Footer>
      </Modal>
    </Fragment>
  )
};
