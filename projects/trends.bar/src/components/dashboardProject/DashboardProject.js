import React from "reactn";
import {DataSources} from "./subcomponents/DataSources/DataSources";
import {Button, ButtonGroup, ButtonToolbar, Dropdown, DropdownButton} from "react-bootstrap";
import {ProjectContent} from "./DashboardProject.styled";
import {Fragment, useState} from "react";
import {LayoutEditor} from "./subcomponents/Layout/LayoutEditor";
import {DivWL, DivWR, FlexToolbar, My1} from "../../futuremodules/reactComponentStyles/reactCommon.styled";
import {CustomTitle, RocketTitle} from "../../futuremodules/reactComponentStyles/reactCommon";
import {SpinnerTopMiddle} from "../../futuremodules/spinner/Spinner";
import {MakeDefaultLayoutWizard} from "./subcomponents/Layout/MakeDefaultLayoutWizard";
import {addCell, needsWizard, useGetTrend, usePublishTrend} from "./DashBoardProjectLogic";
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
      <My1/>
      <FlexToolbar alignItems={"center"} padding={"10px 10px"}>
        <DivWL width={"200px"}>
          <Button variant={"outline-success"} onClick={() => publish()}>
            <RocketTitle text={"Publish"}/>
          </Button>
        </DivWL>
        <div>
          <ButtonToolbar>
            <ButtonGroup>
              <DropdownButton variant={"info"} as={ButtonGroup} title={<CustomTitle text={layout.trendId} icon={"poll"}/>}>
                <Dropdown.Item onClick={() => setActiveTab(trendTabId)}>
                  <CustomTitle text={"Layout"} icon={"table"}/>
                </Dropdown.Item>
                <Dropdown.Item onClick={() => addCell(layout, setLayout)}>
                  <CustomTitle text={"Add Box"} icon={"plus"}/>
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {setActiveTab(dataSourcesId); }}>
                  <CustomTitle text={"Sources"} icon={"layer-group"}/>
                </Dropdown.Item>
              </DropdownButton>
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
        {activeTab === trendTabId &&
        <LayoutEditor
          username={username}
          layout={layout}
          setLayout={setLayout}
        />
        }
        {activeTab === dataSourcesId &&
        <DataSources state={state} dispatch={dispatch} layout={layout} setLayout={setLayout}/>}
      </ProjectContent>
    </Fragment>
  );
};

// export default DashboardProject;
