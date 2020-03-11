import {graphLayoutModel} from "../models/models";
import * as db from "../db";

module.exports = {

  xyType: () => {
    return "_xy_";
  },

  xyDateInt: () => {
    return `${module.exports.xyType()}DateInt`;
  },

  xyDateFloat: () => {
    return `${module.exports.xyType()}Float`;
  },

  is2d: type => {
    return (type.substr(0, module.exports.xyType().length) === module.exports.xyType());
  },

  declare: (type, label, subLabel = "") => {
    return {
      type: type,
      label: label,
      subLabel: subLabel,
    }
  },

  acquire: async (type, label, subLabel = "") => {
    const res = await db.upsert(graphLayoutModel, {type, label, subLabel});
    return res.toObject();
  },

  prepareValue: (type, inputs, value) => {
    if (module.exports.is2d(type)) {
      return [ inputs.values[0], value];
    }
    return value;
  },

  prepareSingleValue: (type, input, value) => {
    if (module.exports.is2d(type)) {
      return [ input, value];
    }
    return value;
  }

};
