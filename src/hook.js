/**
 * 用于配置指定时期发生的事件
 * 暂时写死
 */
// const hooks = {
// 	push: {
// 		before: {
// 			only: ['pro', 'uat']
// 		}
// 	}
// }

// const hookFn = (stage, _curBranch, cb)=> {
// 	let stageList = stage.split('.')
// 	let finalState;
// 	if(stageList && stageList.length) {
// 		finalState = stageList.reduce(function(b,n) {
// 			return b[n] ? b[n] : undefined
// 		}, hooks)
// 	}
// 	if(finalState && finalState.only) {
// 		if(finalState.includes(_curBranch)) {
// 			cb && cb()
// 		}
// 	}
// }
const ME = '@me'
class Hook {
	constructor() {
		this.eventList = {}
	}
	register(hookName, obj) {
		this.eventList[hookName] = this.eventList[hookName] && this.eventList[hookName].length ? this.eventList[hookName] : []
		this.eventList[hookName].push(obj)
	}
	publish(hookName, _branch, query) {
		let l = this.eventList[hookName]
		if(l && l.length) {
			l.map(item => {
				// 条件
				let c = item.only
				let exclude = item.exclude

				// 符合条件包含执行
				if(c && c.length && (c.includes(_branch) || c.includes(ME))) {
					item.fn(query)
					return item
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