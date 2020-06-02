
// 带上前缀
const formatStr = (num)=> {
	let s = `${num}`
	let len = s.length
	if(len<2) {
		return `0${num}`
	} else {
		return num
	}
}


/**
 * 按日期划分
 * 自动输出tag
 * @param {*} tags 所有tag的列表
 */
const dateTag = (tags, options={})=> {
	const prefix = options.prefix || 'v'
	// 日期设置
	const date = new Date()
	const month = date.getMonth()+1
	const day = date.getDate()
	const YYYY = date.getFullYear()
	const YY = YYYY.toString().substr(2)
	const MM = month > 10 ? month : `0${month}`
	const M = month
	const DD = day > 10 ? day : `0${day}`
	const D = day

	const type = options.type || 'YY.MM.DD'
	const lastSplitSym = type.match(/[^YDM]$/ig) ? '' : '.'
	const useType = type.replace(/yyyy/ig, YYYY).replace(/yy/ig, YY).replace(/MM/ig, MM).replace(/m/ig, M).replace(/DD/ig, DD).replace(/D/ig, D)
	
	const curTagHead = `${prefix}${useType}${lastSplitSym}` // 头部匹配

	// 如果不存在tag 则直接输出当前配置的tag
	if(!(tags && tags.length)) return `${prefix}${useType}${lastSplitSym}01`;

	const tagsList = Object.prototype.toString.call(tags) === '[object Array]' ? tags : tags.split('\n')
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


// 按版本划分
const versionTag = (tags, type, options={})=> {
	let initial = '1.0.0';
	const prefix = options.prefix || 'v';
	let arr = [];
	let lmax = 0;
	const tagList = Object.prototype.toString.call(tags) === '[object Array]' ? tags : tags.split('\n')
	if(!(tagList && tagList.length)) {
		return initial
	}

	tagList.map(item => {
		let t = item.replace(prefix, '')
		let tarr = t.split('.')
		// 判断是可以转化为数字   有些情况可能不能转化
		if(Number(tarr[0]) || Number(tarr[0])==0) {
			if(tarr.length == 3) {
				arr.push(tarr)
				lmax = Math.max(lmax, tarr[0])
			}
		}
	})

	let mmax = 0;
	
	let mmaxList = arr.filter(item => {
		if(item[0] == lmax) {
			mmax = Math.max(mmax, item[1])
		}
		return item[0] == lmax
	})

	let smax = 0;
	mmaxList.map(item=> {
		if(item[1]==mmax) {
			smax = Math.max(smax, item[2])
		}
	})

	if(type.match(/l\+\d/)) {
		lmax = lmax + Number(type.replace(/l\+/, ''))
		return `${prefix}${lmax}.0.0`
	}
	if(type.match(/m\+\d/)) {
		mmax = mmax + Number(type.replace(/m\+/, ''))
		return `${prefix}${lmax}.${mmax}.0`
	}
	if(type.match(/s\+\d/)) {
		smax = smax + Number(type.replace(/s\+/, ''))
		return `${prefix}${lmax}.${mmax}.${smax}`
	}
}


module.exports = {
	dateTag,
	versionTag
}