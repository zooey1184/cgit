const mini = require('minimist')
const argvs = mini(process.argv)
const paths = require('./path')
const cgitConfig = paths.cgitConfig
const {dateTag, versionTag} = require('./getTag')
const TAG = argvs['t'] || undefined

const getTag = (all_tags, _branch)=> {
  if(cgitConfig && cgitConfig.tag) {
    const TAG_item = cgitConfig.tag
    let useTag;
    
    for(let i=0; i<TAG_item.length; i++) {
      if(TAG_item[i].test.test(_branch)) {
        if(TAG_item[i].use) {
          useTag = TAG_item[i].use()
          break;
        }
        if(typeof TAG == 'boolean') {
					const CUSTOM_TAG = argvs['tag']
          if(CUSTOM_TAG) {
            useTag = CUSTOM_TAG;
          } else {
            if(TAG_item[i].mode == 'date') {
              useTag = dateTag(all_tags, TAG_item[i])
            } else if(TAG_item[i].mode == 'version') {
              useTag = versionTag(all_tags, TAG_item[i].type, TAG_item[i])
            } else {
              useTag = versionTag(all_tags, 's+1', TAG_item[i])
            }
          }
          break;
        }
        if(TAG.match(/\w\+\d/)) {
          useTag = versionTag(all_tags, TAG, TAG_item[i])
          break;
        }
        if(TAG=='date') {
          useTag = dateTag(all_tags, TAG_item[i])
          break;
        }
      } else {
        // 退出函数进程
        process.exit(1)
      }
    }
    return useTag
  }
}

module.exports = getTag