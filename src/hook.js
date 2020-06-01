
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

				// 符合条件包含执行
				if(Object.prototype.toString.call(c)=='[object RegExp]') {
					if(c.test(_branch)) {
						item.fn(query)
						return item
					}
				}
				if(c && c.length && (c.includes(_branch) || c.includes(ME))) {
					item.fn(query)
					return item
				}

				if(Object.prototype.toString.call(exclude)=='[object RegExp]') {
					if(!exclude.test(_branch)) {
						item.fn(query)
						return item
					}
				}
				// 符合条件不包含的执行
				if(exclude && exclude.length && (!exclude.includes(_branch))) {
					item.fn(query)
					return item
				}
			})
		}
	}
	cancle(e) {
		delete this.eventList[e]
	}
}

module.exports = new Hook()