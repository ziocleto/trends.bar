import {arrayObjectExistsNotEmpty} from "../../../../futuremodules/utils/utils";

const setFirstGroupKey = (gt) => {
  let hasOne = true;
  if (!arrayObjectExistsNotEmpty(gt.tree)) {
    hasOne = false;
  }
  if (hasOne) {
    for (const elem of Object.keys(gt.tree)) {
      if (arrayObjectExistsNotEmpty(gt.tree[elem])) {
        gt.groupTabKey = elem;
        getFirstSubGroupKey(gt);
        hasOne = true;
        break;
      }
    }
  }
  if (!hasOne) {
    gt.groupTabKey = null;
    gt.subGroupTabKey = null;
    delete gt.tree;
  }
};

const getFirstSubGroupKey = (gt) => {
  if (arrayObjectExistsNotEmpty(gt.tree[gt.groupTabKey])) {
    gt.subGroupTabKey = Object.keys(gt.tree[gt.groupTabKey])[0];
  }
};

const setFirstSubGroupKey = (gt) => {
  if (arrayObjectExistsNotEmpty(gt.tree[gt.groupTabKey])) {
    gt.subGroupTabKey = Object.keys(gt.tree[gt.groupTabKey])[0];
  } else {
    delete gt.tree[gt.groupTabKey];
    setFirstGroupKey(gt);
  }
};

export const setGroupKey = (e, gk, graphTree, setGraphTree) => {
  e.stopPropagation();
  let tmp = graphTree;
  tmp.groupTabKey = gk;
  getFirstSubGroupKey(tmp);
  setGraphTree({...tmp});
};

export const setSubGroupKey = (e, sgk, graphTree, setGraphTree) => {
  e.stopPropagation();
  setGraphTree({
    ...graphTree,
    subGroupTabKey: sgk
  });
};

export const onDeleteEntity = (e, elem, graphTree, setGraphTree) => {
  e.stopPropagation();
  let tmp = graphTree;
  delete tmp.tree[graphTree.groupTabKey][graphTree.subGroupTabKey][elem];
  if (Object.keys(tmp.tree[graphTree.groupTabKey][graphTree.subGroupTabKey]).length === 0) {
    delete tmp.tree[graphTree.groupTabKey][graphTree.subGroupTabKey];
    setFirstSubGroupKey(tmp);
  }
  tmp.script.keys.y = tmp.script.keys.y.filter(eg => eg.key !== elem);
  setGraphTree({...tmp});
};

export const onDeleteSubGroup = (e, elem, graphTree, setGraphTree) => {
  e.stopPropagation();
  let tmp = graphTree;
  delete tmp.tree[graphTree.groupTabKey][elem];
  setFirstSubGroupKey(tmp);
  setGraphTree({...tmp});
};

export const onDeleteGroup = (e, elem, graphTree, setGraphTree) => {
  e.stopPropagation();
  let tmp = graphTree;
  delete tmp.tree[elem];
  tmp.script.keys.group = tmp.script.keys.group.filter(eg => eg.yValueGroup !== elem);
  setFirstGroupKey(tmp);
  setGraphTree({...tmp});
};

export const renameGroup = (oldName, newName, graphTree, setGraphTree) => {
  let tmp = graphTree;
  const values = tmp.tree[oldName];
  delete tmp.tree[oldName];
  tmp.tree[newName] = values;
  tmp.groupTabKey = newName;
  setGraphTree({...tmp});
};

export const renameSubGroup = (oldName, newName, graphTree, setGraphTree) => {
  let tmp = graphTree;
  const values = tmp.tree[graphTree.groupTabKey][oldName];
  delete tmp.tree[graphTree.groupTabKey][oldName];
  tmp.tree[graphTree.groupTabKey][newName] = values;
  tmp.subGroupTabKey = newName;
  setGraphTree({...tmp});
};

export const renameYValueName = (oldName, newName, graphTree, setGraphTree) => {
  let tmp = graphTree;

  const values = tmp.tree[graphTree.groupTabKey][graphTree.subGroupTabKey][oldName];
  delete tmp.tree[graphTree.groupTabKey][graphTree.subGroupTabKey][oldName];
  tmp.tree[graphTree.groupTabKey][graphTree.subGroupTabKey][newName] = values;

  setGraphTree({...tmp});
};

export const getLabelTransformOfGroup = (groupName, graphTree) => {
  for (const group of graphTree.script.keys.group) {
    if (group.yValueGroup === groupName) {
      return group.labelTransform === "None" ? "" : group.labelTransform;
    }
  }
  return "";
};

export const setLabelTransformOfGroup = (groupName, newTransform, graphTree, setGraphTree) => {
  let tmp = graphTree;
  tmp.script.keys.group.map(elem => {
    if (elem.yValueGroup === groupName) {
      elem.labelTransform = newTransform;
    }
    return elem;
  });
  setGraphTree({...tmp});
};
