import React from "react";
import {sanitizePathRoot} from "../../futuremodules/utils/utils";
import {useLocation} from "react-router-dom";
import GridLayout from "react-grid-layout";
import {DivLayoutStatic} from "../dashboardProject/subcomponents/Layout/LayoutEditor.styled";
import {ContentWidget} from "../dashboardProject/subcomponents/ContentWidgets/ContentWidget";
import {SpinnerTopMiddle} from "../../futuremodules/spinner/Spinner";
import {useGetTrend} from "../dashboardProject/DashBoardProjectLogic";

const makeLayoutStatic = layout => {
  let ret = layout;
  for( let l of ret.gridLayout ) {
    l.static = true;
  }
  return ret;
};

const TrendPage = () => {
  const [username, trendId] = sanitizePathRoot(useLocation().pathname).split("/");
  const {layout} = useGetTrend(trendId, username);

  if (!layout) return (<SpinnerTopMiddle/>);

  const layoutStatic = makeLayoutStatic(layout);

  return (
    <GridLayout layout={layoutStatic.gridLayout}
                cols={12}
                rowHeight={50}
                width={1024}>
      {layoutStatic.gridLayout.map(elem => {
        return (
          <DivLayoutStatic key={elem.i}>
            <ContentWidget datasets={layout.datasets}
                           config={layoutStatic.gridContent[layoutStatic.gridLayout.findIndex(v => v.i === elem.i)]}
            />
          </DivLayoutStatic>
        );
      })}
    </GridLayout>
  );
};

export default TrendPage;
