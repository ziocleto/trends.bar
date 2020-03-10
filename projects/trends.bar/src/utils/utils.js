
export const alphaBool = flag => {
  return flag === true ? "true" : "false";
};

export const getFileName = pathname => {
  const firstSplit = pathname.split("\\");
  if (firstSplit.length) {
    const fname = firstSplit.pop();
    const secondSplit = fname.split("/");
    if (secondSplit.length) {
      return secondSplit.pop();
    }
  }

  return pathname;
};

export const getFileNameOnlyNoExt = pathname => {
  let ret = getFileName(pathname);
  return ret.substring(0, ret.lastIndexOf(".")) || ret;
};

export const getFileNameExt = filename => {
  return filename.split('.').pop().toLowerCase();
};

export const sanitize = name => {
  let ret = name[0] === "/" ? name.slice(1) : name;
  ret = ret.toLowerCase();
  return ret;
};
