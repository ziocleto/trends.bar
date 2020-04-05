export const getDefaultTrendLayout = (trendId, username) => {

  const granularity = 3;
  const cols = 3;
  const width = 984;
  const name = "Grid3x3";

  let gridLayout = [];
  let gridContent = [];
  let i = 0;
  for ( let y = 0; y < 3; y++ ) {
    for ( let x = 0; x < 3; x++ ) {
      gridLayout.push( {
        i: i.toString(), x: x*granularity, y: y*granularity, w: granularity, h: granularity
      });
      gridContent.push(getDefaultCellContent(i));
      i++;
    }
  }

  return {
    name,
    trendId,
    username,
    granularity,
    cols,
    width,
    gridLayout,
    gridContent
  }
};

export const getDefaultCellContent = (i) => {
  return getDefaultWidgetContent("text",i);
}

export const getDefaultWidgetContent = (type,i) => {
  switch (type) {
    case "text": {
      return getDefaultWidgetTextContent(i);
    }
    case "table": {
      return getDefaultWidgetTableContent(i);
    }
    case "graphxy": {
      return getDefaultWidgetGraphXYContent(i);
    }
    default: {
      return getDefaultWidgetTextContent(i);
    }
  }
}

const getDefaultWidgetGraphXYContent = (i) => {
  return {
    i: i.toString(),
    type: "graphxy",
    title: "Graph title",
    series: [
        getDefaultWidgetGraphXYSerieContent()
    ]
  }
}

export const getDefaultWidgetGraphXYSerieContent = () => {
  return {
    title: "Serie",
    query: "$[0].values[*]",
    fieldX: "x",
    transformX: "toDateDD/MM",
    fieldY: "y",
    transformY: ""
  }
}

const getDefaultWidgetTextContent = (i) => {
  return {
    i: i.toString(),
    type: "text",
    title: "Title "+i.toString(),
    subtitle: "Subtitle "+i.toString(),
  };
}

const getDefaultWidgetTableContent = (i) => {
  return {
    i: i.toString(),
    type: "table",
    tableKeyTitle: "Date",
    tableKeyQuery: "$[0].values[*]",
    tableKeyField: "x",
    tableKeyTransform: "toDateDD/MM/YYYY",
    tableColumns: [
        getDefaultWidgetTableColumnContent()
    ]
  };
}

export const getDefaultWidgetTableColumnContent = () => {
  return {
    title: "Column",
    query: "$[0].values[*]",
    field: "y",
    transform: ""
  }
}
