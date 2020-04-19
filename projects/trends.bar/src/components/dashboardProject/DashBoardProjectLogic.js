import {getDefaultCellContent} from "../../modules/trends/layout";
import {useMutation} from "@apollo/react-hooks";
import {upsertTrendLayout} from "../../modules/trends/mutations";
import {useAlertSuccess} from "../../futuremodules/alerts/alerts";

export const addCell = (layout, setLayout) => {
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

export const useSaveLayout = (trendId, username) => {
  const [trendLayoutMutation] = useMutation(upsertTrendLayout);
  const alertSuccess = useAlertSuccess();

  const updater = (layout) => {
    // Remove datasets from query
    let layoutNoDatasets = {...layout};
    layoutNoDatasets.trendId = trendId;
    layoutNoDatasets.username = username;
    delete layoutNoDatasets.name;
    delete layoutNoDatasets.datasets;
    delete layoutNoDatasets.trendGraphs;
    trendLayoutMutation({
      variables: {
        trendLayout: layoutNoDatasets
      }
    }).then(() => alertSuccess("Yeah, you're live!"));
  };

  return updater;
};

