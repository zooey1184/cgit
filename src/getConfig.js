const child_process = require('child_process')

const getGitConfig = ()=> {
	const config = child_process.execSync('git config --global -l', { 'encoding': 'utf8' })
	const configList = config.split('\n')
	let obj = {}
	configList.map(item => {
		let [key, val] = item.split('=')
		obj[key] = val
	})
	return obj
}

module.exports = getGitConfig