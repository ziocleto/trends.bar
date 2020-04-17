import React from "react";
import {sanitizePathRoot} from "../../futuremodules/utils/utils";
import {useLocation} from "react-router-dom";
import GridLayout from "react-grid-layout";
import {DivFixedCenterTopMiddle, DivLayout} from "../dashboardProject/subcomponents/Layout/LayoutEditor.styled";
import {ContentWidget} from "../dashboardProject/subcomponents/ContentWidgets/ContentWidget";
import {useGetTrend} from "../../modules/trends/globals";
import {Spinner} from "react-bootstrap";


const TrendPage = () => {
  const [username, trendId] = sanitizePathRoot(useLocation().pathname).split("/");
  const {layout, datasets} = useGetTrend(trendId, username);

  if (!layout || !datasets) return (
    <DivFixedCenterTopMiddle>
    <Spinner animation="grow" variant="warning"/>
    </DivFixedCenterTopMiddle>);

  return (
    <GridLayout layout={layout.gridLayout}
                cols={12}
                rowHeight={50}
                width={1024}>
      {layout.gridLayout.map(elem => {
        return (
          <DivLayout key={elem.i}>
            <ContentWidget datasets={datasets}
                           config={layout.gridContent[layout.gridLayout.findIndex(v => v.i === elem.i)]}
            />
          </DivLayout>
        );
      })}
    </GridLayout>
  );
};

export default TrendPage;
