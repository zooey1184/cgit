const fs = require('fs-extra');

/**
 * 判断是否存在文件 upload by test
 * @param {*} path 绝对路径
 */
const existFile = (path) => {
  try {
    fs.accessSync(path, fs.F_OK);
  } catch (e) {
    return false;
  }
  return true;
}

module.exports = existFile
