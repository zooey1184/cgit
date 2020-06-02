const spawn = require('cross-spawn');

const ME = '@ME'
class Hook {
	constructor() {
		this.eventList = {}
	}
	register(hookName, obj) {
		this.eventList[hookName] = this.eventList[hookName] && this.eventList[hookName].length ? this.eventList[hookName] : []
		this.eventList[hookName].push(obj)
	}
	hasHook(hookName) {
		return this.eventList[hookName] && this.eventList[hookName].length>0
	}
	publish(hookName, _branch, query) {
		let l = this.eventList[hookName]
		if(l && l.length) {
			l.map(item => {
				// 条件
				let c = item.only
				let exclude = item.exclude

				function doit() {
					item.fn && item.fn(query)
					// 暂时只支持数组类型
					if(item.scripts && item.scripts.length) {
						for(let i=0; i<item.scripts.length; i++) {
							let [e, ...last] = item.scripts[i]
							spawn.sync(e, last, { stdio: 'inherit', env: process.env })
						}
					}
					return item
				}

				// 符合条件包含执行
				if(Object.prototype.toString.call(c)=='[object RegExp]') {
					c.test(_branch) && doit()
				}

				c && c.length && (c.includes(_branch) || c.includes(ME)) && doit()

				if(Object.prototype.toString.call(exclude)=='[object RegExp]') {
					!exclude.test(_branch) && doit()
				}
				// 符合条件不包含的执行
				exclude && exclude.length && (!exclude.includes(_branch)) && doit()
			})
		}
	}
	cancle(e) {
		delete this.eventList[e]
	}
}

module.exports = new Hook()