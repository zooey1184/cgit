const rootPath = process.cwd()
const path = require('path')

/**
 * 获取绝对路径
 * @param {*} path 相对路径 相对于当前工程 ../ => 表示根目录上一级  /表示当前根
 */
const getPath = p => path.resolve(rootPath, p)
module.exports = getPath
