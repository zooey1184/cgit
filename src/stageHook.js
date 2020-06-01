
const stage = [
	'merge',
	'pull',
	'push'
]
// 这里其实只是注入方法，具体释放方法要写入具体的位置
// h => 配置   hook => hook 实例
const hookStage = (h, hook)=> {
	for(let i=0; i<stage.length; i++) {
		(()=> {
			let s = stage[i].replace(/\b(\w)|\s(\w)/, (m)=> m.toUpperCase())
			let before = `before${s}`
			let after = `after${s}`
			h[before] && hook.register(before, h[before])
			h[after] && hook.register(after, h[after])
		})()
	}
}

module.exports = hookStage