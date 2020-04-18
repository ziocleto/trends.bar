import React, {useGlobal} from "reactn";
import {DataSources} from "./subcomponents/DataSources/DataSources";
import {Button, ButtonGroup, ButtonToolbar, Dropdown, SplitButton} from "react-bootstrap";
import {ProjectContent} from "./DashboardProject.styled";
import {Fragment, useState} from "react";
import {LayoutEditor} from "./subcomponents/Layout/LayoutEditor";
import {DivWL, DivWR, FlexToolbar} from "../../futuremodules/reactComponentStyles/reactCommon.styled";
import {EditingUserTrend, useGetTrend} from "../../modules/trends/globals";
import {getDefaultCellContent} from "../../modules/trends/layout";
import {CustomTitle, RocketTitle} from "../../futuremodules/reactComponentStyles/reactCommon";
import {useMutation} from "@apollo/react-hooks";
import {upsertTrendLayout} from "../../modules/trends/mutations";
import {SpinnerTopMiddle} from "../../futuremodules/spinner/Spinner";
import {MakeDefaultLayoutWizard} from "./subcomponents/Layout/MakeDefaultLayoutWizard";

const needsWizard = (layout) => {
  return (layout && layout.wizard);
};

const DashboardProject = ({username, trendId}) => {

  const dataSourcesId = "DataSources";
  const trendTabId = "Trend";
  const [activeTab, setActiveTab] = useState(trendTabId);
  const [, setEditingUserTrend] = useGlobal(EditingUserTrend);
  const {layout, setLayout} = useGetTrend(trendId, username);
  const [trendLayoutMutation] = useMutation(upsertTrendLayout);

  const needWizard = needsWizard(layout);
  const [showWizard, setShowWizard] = useState(false);
  console.log("Needs a wizard? ", needWizard);
  if (needWizard || showWizard) {
    return <MakeDefaultLayoutWizard
      setLayout={setLayout}
      onClose={() => setShowWizard(false)}
    />;
  }

  if (!layout) {
    return <SpinnerTopMiddle/>
  }

  const onAddCell = () => {
    const newGridLayout = [...layout.gridLayout];
    const newGridContent = [...layout.gridContent];
    const newIndex = Math.max(...(layout.gridLayout.map((v) => Number(v.i)))) + 1;
    newGridLayout.push({
      i: newIndex.toString(),
      x: 0,
      y: 0,
      w: 3,
      h: 3
    });
    newGridContent.push(getDefaultCellContent(newIndex, layout.datasets));
    setLayout({
      ...layout,
      gridLayout: newGridLayout,
      gridContent: newGridContent
    });
  };

  const onSaveLayout = () => {
    trendLayoutMutation({
      variables: {
        trendLayout: layout
      }
    }).then();
  };

  console.log(layout);

  return (
    <Fragment>
      <FlexToolbar margin={"12px"}>
        <DivWL width={"200px"}>
          <Button variant={"outline-success"} className="mr-4" onClick={onSaveLayout}><RocketTitle
            text={"Publish"}/></Button>
        </DivWL>
        <div>
          <ButtonToolbar>
            <ButtonGroup>
              <SplitButton as={ButtonGroup} title={<CustomTitle text={"Trend"} icon={"poll"}/>}
                           variant={activeTab && activeTab === trendTabId ? "info" : "primary"}
                           onClick={() => setActiveTab(trendTabId)}>
                <Dropdown.Item onClick={onAddCell}>
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
