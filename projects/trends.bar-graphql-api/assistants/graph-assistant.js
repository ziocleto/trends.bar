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

  declare: (type, label, subLabel) => {
    return {
      type: type,
      label: label,
      subLabel: subLabel,
    }
  },

  prepareValue: (type, inputs, value) => {
    if (module.exports.is2d(type)) {
      return [ inputs.values[0], value];
    }
    return value;
  }

};
