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
import {layoutStandardCols} from "../../../../modules/trends/globals";
import {RowSeparatorDoubleHR} from "../../../../futuremodules/reactComponentStyles/reactCommon";
import {useState} from "react";
import {ImportDataSources} from "../DataSources/ImportDataSources";
import {getDefaultCellContent} from "../../../../modules/trends/layout";

const lsc = layoutStandardCols;

const createLayoutBlog = () => {
  let gridLayout = [];
  const top = lsc / 4;
  gridLayout.push({i: "0", x: 0, y: 0, w: lsc, h: top, static: true});
  gridLayout.push({i: "1", x: 0, y: top, w: lsc, h: lsc - top, static: true});
  return gridLayout;
};

const createLayoutBlog2 = () => {
  let gridLayout = [];
  const top = 1;
  const middle = lsc / 4;
  gridLayout.push({i: "0", x: 0, y: 0, w: lsc, h: top, static: true});
  gridLayout.push({i: "1", x: 0, y: top, w: lsc, h: middle, static: true});
  gridLayout.push({
    i: "2",
    x: 0,
    y: top + middle,
    w: lsc,
    h: lsc - top - middle,
    static: true
  });
  return gridLayout;
};

const createLayoutCovid = () => {
  const top = 2;
  const t3 = lsc / 3;
  const middle = lsc / 4;
  return [
    {i: "0", x: 0, y: 0, w: lsc, h: top, static: true},
    {i: "1", x: 0, y: top, w: lsc / 3, h: middle, static: true},
    {i: "2", x: t3, y: top, w: lsc / 3, h: middle, static: true},
    {i: "3", x: t3 * 2, y: top, w: lsc / 3, h: middle, static: true},
    {i: "4", x: 0, y: top + middle, w: lsc, h: lsc - top - middle, static: true},
  ];
};

const createLayoutCovid2 = () => {
  const top = 2;
  const t3 = lsc / 3;
  const middle = lsc / 4;
  const h1 = (lsc - (top + middle)) / 2;
  return [
    {i: "0", x: 0, y: 0, w: lsc, h: top, static: true},
    {i: "1", x: 0, y: top, w: lsc / 3, h: middle, static: true},
    {i: "2", x: t3, y: top, w: lsc / 3, h: middle, static: true},
    {i: "3", x: t3 * 2, y: top, w: lsc / 3, h: middle, static: true},
    {i: "4", x: 0, y: top + middle, w: lsc, h: h1, static: true},
    {i: "5", x: 0, y: top + middle + h1, w: lsc, h: h1, static: true},
  ];
};

const createDefaultLayouts = () => {
  return [
    createLayoutBlog(),
    createLayoutBlog2(),
    createLayoutCovid(),
    createLayoutCovid2(),
  ]
};

const saveLayout = (layout, setLayout, setStep ) => {
  let gridContent = [];

  for (let i = 0; i < layout.length; i++) {
    gridContent.push(getDefaultCellContent(i, null));
    layout[i].static = false;
  }
  setLayout( {
    gridLayout: layout,
    gridContent
  });
  setStep(step => step + 1);
};

export const MakeDefaultLayoutWizard = ({setLayout, onClose}) => {

  const [step, setStep] = useState(1);
  const [wizardLayout, setWizardLayout] = useState(null);
  const layouts = createDefaultLayouts();

  return (
    <Fragment>
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show
        // onHide={() => onClose()}
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
              {step === 1 && layouts.map(layout =>
                <Col key={JSON.stringify(layout)}>
                  <ButtonBgDiv
                    borderColor={"var(--info)"}
                    backgroundColor={"var(--dark)"}
                    padding={"10px"}
                    onClick={() => saveLayout(layout, setWizardLayout, setStep)}
                  >
                    <GridLayout layout={layout}
                                cols={lsc}
                                rowHeight={10}
                                width={1024}
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
