const child_process = require('child_process')

// 冲突关键词
const unmergedKeyword = 'unmerged paths'
const fixKeyword = 'fix conflicts'

const hasConflict = ()=> {
	const status = child_process.execSync('git status', { 'encoding': 'utf8' });
		// 如果pull 分支后存在冲突 则退出程序
	if(status.match(new RegExp(unmergedKeyword)) || status.match(new RegExp(fixKeyword))) {
		process.exit(1)
	}
}

module.exports = hasConflict