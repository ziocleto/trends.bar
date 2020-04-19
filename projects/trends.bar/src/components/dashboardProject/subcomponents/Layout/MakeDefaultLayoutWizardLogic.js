import {layoutStandardCols} from "../../../../modules/trends/globals";
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

export const createDefaultLayouts = () => {
  return [
    createLayoutBlog(),
    createLayoutBlog2(),
    createLayoutCovid(),
    createLayoutCovid2(),
  ]
};

export const saveLayout = (layout, setLayout, setStep ) => {
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
