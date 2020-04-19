import React, {useGlobal} from "reactn";
import {DataSources} from "./subcomponents/DataSources/DataSources";
import {Button, ButtonGroup, ButtonToolbar, Dropdown, SplitButton} from "react-bootstrap";
import {ProjectContent} from "./DashboardProject.styled";
import {Fragment, useState} from "react";
import {LayoutEditor} from "./subcomponents/Layout/LayoutEditor";
import {Div, DivWL, DivWR, Flex, FlexToolbar, Text} from "../../futuremodules/reactComponentStyles/reactCommon.styled";
import {EditingUserTrend, useGetTrend} from "../../modules/trends/globals";
import {CustomTitle, RocketTitle} from "../../futuremodules/reactComponentStyles/reactCommon";
import {SpinnerTopMiddle} from "../../futuremodules/spinner/Spinner";
import {MakeDefaultLayoutWizard} from "./subcomponents/Layout/MakeDefaultLayoutWizard";
import {addCell, useSaveLayout} from "./DashBoardProjectLogic";

const needsWizard = (layout) => {
  return (layout && layout.wizard);
};

const dataSourcesId = "DataSources";
const trendTabId = "Trend";

const DashboardProject = ({username, trendId}) => {

  const [activeTab, setActiveTab] = useState(trendTabId);
  const [, setEditingUserTrend] = useGlobal(EditingUserTrend);
  const {layout, setLayout} = useGetTrend(trendId, username);
  const saveLayout = useSaveLayout(trendId, username);

  if (needsWizard(layout)) {
    return <MakeDefaultLayoutWizard setLayout={setLayout}/>;
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
            {trendId}
          </Text>
        </Div>
      </Flex>
      <FlexToolbar margin={"5px"}>
        <DivWL width={"200px"}>
          <Button variant={"outline-success"} onClick={() => saveLayout(layout)}>
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
            onClick={() => setEditingUserTrend(null)}>
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
        {activeTab && activeTab === dataSourcesId && <DataSources layout={layout} setLayout={setLayout}/>}
      </ProjectContent>
    </Fragment>
  );
};

export default DashboardProject;
