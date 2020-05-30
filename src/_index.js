#!usr/bin/env node
/**
 * date: 2020-05-11
 * author: zyy
 * info: 自动集成git命令
 * git add -》commit -》checkout xxx -》 pull -》 merge -》 status
 * ps: 暂未开放
 */
const spawn = require('cross-spawn');
const child_process = require('child_process')

const [, , ...argv] = process.argv
const PRO = require('../tools/getPro')
const getNewTag = require('./getTag')
const getGitConfig = require('./getConfig')
const hasConflict = require('./hasConflict')
const log = require('../tools/log')
const hook = require('./hook')

const getBranchInfo = ()=> {
  // 获取所有分支
  const branch = child_process.execSync('git branch -a', { encoding: 'utf8' });
  const branchList = branch.split('\n').map(item => item.trim())

  // 获取当前分支
  let currentBranch = branch.match(/\* .+/)[0]
  currentBranch = currentBranch ? currentBranch.substr(2, currentBranch.length - 1) : ''
  return {
    branchList,
    currentBranch
  }
}

const {branchList, currentBranch} = getBranchInfo()

/**
 * 判断远程是否有某分支
 * @param b 分支名称
 * => boolean
 * true => 有
 * false => 没有
 */
const hasRemoteBranch = (b) => {
  if (branchList.includes(`remotes/origin/${b}`)) {
    return true
  }
  return false
}

const CK_Branch = argv[0]
if(!CK_Branch) {
  log.error(' Error ', '请输入你要切换的分支', 'npm run cg xxx')
  process.exit()
}
const MSG = argv[1] ? argv[1] : `"更新项目: ${PRO}, 本地分支: ${CK_Branch}"`
const TAG = argv[2]

const add_commit = (msg) => {
  spawn.sync('git', ['add', '.'], { stdio: 'inherit' })
  spawn.sync('git', ['commit', '-m', msg], { stdio: 'inherit' })
  log.success('\n add & commit success ', msg)
}

const pull_status = (_branch, next) => {
  // 如果远程有分支 下一步则进行拉取最新代码 否则退出
  if (hasRemoteBranch(_branch)) {
    spawn.sync('git', ['pull'], { stdio: 'inherit' })
    log.success('\n pull success ', _branch)
    hasConflict()
  } else {
    next && next()
  }
}

const checkout = (_branch) => {
  try {
    child_process.execSync(`git checkout ${_branch}`, { encoding: 'utf8' });
    log.info(' checkout ', `切换到分支${_branch}`)
  } catch (e) {
    log.error('\n Error ', `不存在分支，请先新建分支， git checkout -b ${_branch}`)
    process.exit()
  }
}


const merge = (obj) => {
  try {
    // 如果合并分支来自[pro, uat] 则不进行合并
    hook.publish('beforeMerge', obj.mergeFrom, obj.mergeFrom)
  } catch (e) {
    hasConflict()
    log.error(' Error ', 'merge 发生了错误')
    console.log(e);
    process.exit()
  }
  hasConflict()
}

const pushTag = () => {
  // 获取tags 名称
  const all_tags = child_process.execSync('git tag -l', { encoding: 'utf8' });
  const newTag = TAG || getNewTag(all_tags)
  const config = getGitConfig()
  spawn.sync('git', ['tag', '-a', newTag, '-m', `"项目: ${PRO}"； 提交人: ${config['user.name']}`], { stdio: 'inherit' })
  spawn.sync('git', ['push', 'origin', newTag], { stdio: 'inherit' })
}

const push = (_branch, next) => {
  if (hasRemoteBranch(_branch)) {
    try {
      log.success('\n 远程分支 ', _branch, '\n开始推送，请勿中断')
      hook.publish('beforePush', _branch)
      try {
        spawn.sync('git', ['push', 'origin', _branch], { stdio: 'inherit' })
      } catch (e) {
        log.error(' Error ', `不能提交到分支${_branch}`)
      }
      const info = getBranchInfo()
      hook.publish('afterPush', info.currentBranch)
    } catch (e) {
      log.error(' Error ', e.toString())
    }
  } else {
    log.wran(`\n不存在远程分支${_branch}`)
    next && next()
    // process.exit(1)
  }
}

hook.register('beforeMerge', {
  exclude: ['pro', 'uat'],
  fn: (mergeFrom) => {
    try {
      // spawn. sync('git', ['merge', mergeFrom], {stdio: 'inherit'})
      child_process.execSync(`git merge ${mergeFrom}`, { encoding: 'utf8' });
    } catch (e) {
      log.error(' Error ', '存在冲突', e.toString())
      process.exit()
    }
    hasConflict()
  }
})
hook.register('beforePush', {
  only: ['pro', 'uat'],
  fn: () => {
    spawn.sync('npm', ['run', 'build'], { stdio: 'inherit' })
    add_commit(`build: ${PRO}`)
  }
})
hook.register('afterPush', {
  only: ['pro'],
  fn: () => {
    pushTag()
  }
})

// // ********情况一： 当前分支与切换分支是同一个分支 ***********/
if (CK_Branch && (CK_Branch == currentBranch || CK_Branch == '@me')) {
  // 当前分支与 需切换分支一致
  add_commit(MSG)
  pull_status(currentBranch, () => {
    process.exit()
  })
  add_commit('update')
  push(currentBranch, () => {
    process.exit()
  })
  process.exit()
}


// // ******** 情况二：当前分支与切换分支不是同一个分支 *******/
if (CK_Branch && CK_Branch != currentBranch) {
  // 第一步：本地拉取最新代码 =》 提交信息 =》 推送本地到远程
  pull_status(currentBranch)
  add_commit(MSG)
  push(currentBranch)

  // 第二步：切换到需要的分支，拉取最新代码
  checkout(CK_Branch)
  pull_status(CK_Branch)

  // 第三步：合并本地分支代码，查看冲突
  merge({
    mergeFrom: currentBranch,
    mergeTo: CK_Branch
  })
  hasConflict()

  // 如果没有冲突 进行第四步，提交信息，推送到远程
  add_commit(`merge: ${currentBranch}`)
  push(CK_Branch)

  checkout(currentBranch)
  process.exit()
}
