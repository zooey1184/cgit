const child_process = require('child_process')
const log = require('../tools/log')

const getBranchInfo = ()=> {
  let branch; // 所有分支
  let branchList; // 所有分支列表
  try {
    branch = child_process.execSync('git branch -a', { encoding: 'utf8' });
    branchList = branch.split('\n').map(item => item.trim())
    let currentBranch = branch.match(/\* .+/)[0]
    currentBranch = currentBranch ? currentBranch.substr(2, currentBranch.length - 1) : ''
    return {
      branchList,
      currentBranch // 当前分支
    }
  } catch (e) {
    log.error('\n ERROR ', 'git branch -a 执行错误，可能没有关联到远程仓库')
    log('您可以尝试命令: git remote add origin [url]\n')
    process.exit()
  }
}

module.exports = getBranchInfo