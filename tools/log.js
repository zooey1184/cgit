const chalk = require('chalk')
const log = console.log;

const t = {
	info: 'blue',
	wran: 'yellow',
	warn: 'yellow',
	error: 'red',
	success: 'green',
	tip: 'cyan'
}

for(let i in t) {
	Object.defineProperty(log, i, {
		get: function() {
			if(t[i]) {
				return function () {
					let args = Array.from(arguments)
					let val = t[i]
					if(args.length>1) {
						let [title, ...last] = args
						let bg = 'bg'+ val.replace(/\b(\w)|\s(\w)/g, function(m){
							return m.toUpperCase();
						});
						log(chalk[bg]['black'](title), chalk[val](last.join('\n')))
					} else {
						log(chalk[val](args[0]))
					}
				}
			} else {
				return function() {
					let args = Array.from(arguments)
					if(args.length>1) {
						let [title, ...last] = args
						log(chalk.bgWhite(title), chalk.white(...last.join('\n')))
					} else {
						log(chalk.white(args[0]))
					}
				}
			}
		}
	})
}

module.exports = log
