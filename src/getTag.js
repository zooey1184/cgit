// 带上前缀
const formatStr = (num)=> {
	let s = `${num}`
	let len = s.length
	if(len<2) {
		return `00${num}`
	} else if((len > 1) && (len < 3)) {
		return `0${num}`
	} else {
		return num
	}
}

// 自动输出tag
const getNewTag = (tags, itag)=> {
	if(itag) return itag;
	// 日期设置
	const date = new Date()
	const month = date.getMonth()+1
	const day = date.getDate()
	const mm = month > 10 ? month : `0${month}`
	const dd = day > 10 ? day : `0${day}`

	const curTagHead = `v${mm}.${dd}.` // 头部匹配

	// 如果不存在tag 则直接输出当前配置的tag
	if(!(tags && tags.length)) return `v${mm}.${dd}.001`;

	const tagsList = tags.split('\n')
	// 筛选出匹配头部的
	let currentTagList = tagsList.filter(item => item.match(new RegExp(curTagHead)))
	let max = 0
	// 获取筛选后尾部字符串转为数字并 得到最大数值
	currentTagList.map(item => {
		let matchTag = item.replace(curTagHead, '')
		let curNum = matchTag && Number(matchTag) ? Number(matchTag) : 0
		max = Math.max(curNum, max)
		// return curNum
	})
	const suftag = formatStr(max+1)
	return `${curTagHead}${suftag}`
}

module.exports = getNewTag