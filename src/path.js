// const path = require('path')
const getPath = require('../tools/getAbsPath')
const existFile = require('../tools/existFile')

const resolvePath = function(path) {
	if(existFile(getPath(path))) {
		return require(getPath(path))
	} else {
		return false
	}
}

const paths = {
	cgitConfig: resolvePath('./cgit.config.js')
}


module.exports = paths