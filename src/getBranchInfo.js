const child_process = require('child_process')
const log = require('../tools/log')

const getBranchInfo = ()=> {
  // 获取所有分支
  let branch;
  let branchList
  try {
    branch = child_process.execSync('git branch -a', { encoding: 'utf8' });
    branchList = branch.split('\n').map(item => item.trim())
    let currentBranch = branch.match(/\* .+/)[0]
    currentBranch = currentBranch ? currentBranch.substr(2, currentBranch.length - 1) : ''
    return {
      branchList,
      currentBranch
    }
  } catch (e) {
    const hasRemote = child_process.execSync('git remote', { encoding: 'utf8' });
    if(hasRemote) {
      log.error(' ERROR ', '远程仓库还没有您的提交信息，请先push')
			log('您可以尝试命令: git pull origin [branch(?master)]\n')
			log('OR')
			log('您可以尝试命令: git push --set-upstream origin [branch(?master)]\n')
    } else {
			log.error('\n ERROR ', 'git branch -a 执行错误，可能没有关联到远程仓库')
      log('您可以尝试命令: git remote add origin [url]\n')
    }
    
    
    process.exit()
  }
}

module.exports = getBranchInfo