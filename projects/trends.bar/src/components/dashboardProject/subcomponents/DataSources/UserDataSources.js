import React from "reactn";
import "./DataSources.css"
import {Fragment} from "react";
import {
  DangerColorSpan,
  FlexWithBorder,
  InfoTextSpan,
  SecondaryAltColorTextSpanBold
} from "../../../../futuremodules/reactComponentStyles/reactCommon.styled";
import {arrayExistsNotEmpty} from "../../../../futuremodules/utils/utils";
import {Col, Container, Dropdown, Row, SplitButton} from "react-bootstrap";
import {RocketTitle, RowSeparator} from "../../../../futuremodules/reactComponentStyles/reactCommon";
import {editingDataSourceD} from "../../../dashboardUser/DashboardUserLogic";
import {useRemoveDataSource} from "../../DashBoardProjectLogic";

export const UserDataSources = ({layout, setLayout, dispatch}) => {

  const removeDataSource = useRemoveDataSource(layout, setLayout);

  return (
    <Fragment>
      <Row>
        <Col>
          <RocketTitle text={"Curating:"}/>
        </Col>
      </Row>
      <RowSeparator/>
      <Container fluid>
        {arrayExistsNotEmpty(layout.dataSources) && layout.dataSources.map(elem => {
            return (
              <Row key={elem.name}>
                <FlexWithBorder width={"50%"}>
                  <div>
                    <SecondaryAltColorTextSpanBold>
                      {elem.name}
                    </SecondaryAltColorTextSpanBold>
                  </div>
                  <div>
                    <SplitButton
                      title={<b>Update</b>}
                      variant="info"
                      onClick={() => dispatch([editingDataSourceD, elem])}>
                      <Dropdown.Item>Set to repeat</Dropdown.Item>
                      <Dropdown.Divider/>
                      <Dropdown.Item onClick={() => {removeDataSource(elem.name)} }>
                        <DangerColorSpan>Delete</DangerColorSpan>
                      </Dropdown.Item>
                    </SplitButton>
                  </div>
                </FlexWithBorder>
              </Row>
            )
          }
        )}
      </Container>
      {!arrayExistsNotEmpty(layout.dataSources) && (
        <InfoTextSpan>Nothing yet! Grab or create a new one.</InfoTextSpan>
      )}
    </Fragment>
  )
};
