import {removeDataSourceFieldD, renameDataSourceFieldD} from "../../../dashboardUser/DashboardUserLogic";

export const onDeleteHeader = (e, elem, dispatch) => {
  e.stopPropagation();
  dispatch([removeDataSourceFieldD, elem.name]);
};

export const renameHeader = (oldName, newName, dispatch) => {
  dispatch([renameDataSourceFieldD, oldName, newName]);
};
