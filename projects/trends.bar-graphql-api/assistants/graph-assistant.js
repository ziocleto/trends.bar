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

  declare: (type, title, label = "", subLabel = "", dataSequence = "" ) => {
    return {
      type,
      title,
      label,
      subLabel,
      dataSequence
    }
  },

  prepareValue: (type, inputs, value) => {
    if (module.exports.is2d(type)) {
      return { x: inputs.values[0], y: value };
    }
    return value;
  },

  prepareSingleValue: (type, input, value) => {
    if (module.exports.is2d(type)) {
      return { x: input, y: value };
    }
    return value;
  },

  firstDerivativeOf: (values) => {
    // First derivative
    let newData = [];
    for ( let i = 1; i < values.length; i++ ) {
      const currPoint = values[i].y;
      const prevPoint = values[i-1].y;
      newData.push( {
        x: values[i].x,
        y: currPoint - prevPoint
      });
    }
    return newData;
  }

};
