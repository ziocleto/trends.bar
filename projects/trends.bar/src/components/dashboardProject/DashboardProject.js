import React from "reactn";
import {DataSources} from "./subcomponents/DataSources/DataSources";
import {Button, ButtonGroup, ButtonToolbar, Dropdown, SplitButton} from "react-bootstrap";
import {ProjectContent} from "./DashboardProject.styled";
import {Fragment, useState} from "react";
import {LayoutEditor} from "./subcomponents/Layout/LayoutEditor";
import {Div, DivWL, DivWR, Flex, FlexToolbar, Text} from "../../futuremodules/reactComponentStyles/reactCommon.styled";
import {useGetTrend} from "../../modules/trends/globals";
import {CustomTitle, RocketTitle} from "../../futuremodules/reactComponentStyles/reactCommon";
import {SpinnerTopMiddle} from "../../futuremodules/spinner/Spinner";
import {MakeDefaultLayoutWizard} from "./subcomponents/Layout/MakeDefaultLayoutWizard";
import {addCell, needsWizard, usePublishTrend} from "./DashBoardProjectLogic";
import {editingTrendD} from "../dashboardUser/DashboardUserLogic";

const dataSourcesId = "DataSources";
const trendTabId = "Trend";

export const DashboardProject = ({state, dispatch}) => {

  const {username, editingTrend} = state;
  const [activeTab, setActiveTab] = useState(trendTabId);
  const {layout, setLayout} = useGetTrend(editingTrend, username);
  const publish = usePublishTrend(editingTrend, username);

  console.log("Layout", layout);
  if (needsWizard(layout)) {
    return <MakeDefaultLayoutWizard layout={layout} setLayout={setLayout} state={state} dispatch={dispatch}/>;
  }

  if (!layout) {
    return <SpinnerTopMiddle/>
  }

  return (
    <Fragment>
      <Flex justifyContent={"center"}>
        <Div
          margin={"10px 0 0 0"}>
          <Text
            bold
            fontSize={"var(--font-size-lead)"}
          >
            {editingTrend}
          </Text>
        </Div>
      </Flex>
      <FlexToolbar margin={"5px"}>
        <DivWL width={"200px"}>
          <Button variant={"outline-success"} onClick={() => publish()}>
            <RocketTitle text={"Publish"}/></Button>
        </DivWL>
        <div>
          <ButtonToolbar>
            <ButtonGroup>
              <SplitButton as={ButtonGroup} title={<CustomTitle text={"Trend"} icon={"poll"}/>}
                           variant={activeTab && activeTab === trendTabId ? "info" : "primary"}
                           onClick={() => setActiveTab(trendTabId)}>
                <Dropdown.Item onClick={() => addCell(layout, setLayout)}>
                  <CustomTitle text={"Add Trend Box"} icon={"plus"}/>
                </Dropdown.Item>
              </SplitButton>
              <Button
                variant={activeTab && activeTab === dataSourcesId ? "info" : "primary"}
                onClick={() => setActiveTab(dataSourcesId)}>
                <CustomTitle text={"Sources"} icon={"layer-group"}/>
              </Button>
            </ButtonGroup>
          </ButtonToolbar>
        </div>
        <DivWR width={"200px"}>
          <Button
            variant={"outline-light"}
            onClick={() => {
              dispatch([editingTrendD, null]);
              setLayout(null);
            }}>
            <i className="fas fa-arrow-left"/>
          </Button>
        </DivWR>
      </FlexToolbar>
      <ProjectContent>
        {activeTab && activeTab === trendTabId &&
        <LayoutEditor
          username={username}
          layout={layout}
          setLayout={setLayout}
        />
        }
        {activeTab && activeTab === dataSourcesId && <DataSources state={state} dispatch={dispatch} layout={layout} setLayout={setLayout}/>}
      </ProjectContent>
    </Fragment>
  );
};

// export default DashboardProject;
