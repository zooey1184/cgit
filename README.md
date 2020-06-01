# cgit 集成git命令行

### 安装
```sh
npm i -g @zooey1184/cgit
cnpm i -g @zooey1184/cgit

### 基本用法
```sh
cgit to dev -m "msg" -t s+1
```
上面的例子表示保存当前分支，信息为msg，切换到dev分支，拉取最新代码，合并，检测有无冲突，
如无提交uat远程分支（如果配置了钩子函数会在对应时期进行钩子函数），并打小版本更新tag, 最后切换会本地分支

ps：如果希望只是保存本地分支并且只切换分支dev 建议使用
```sh
cgit checkout dev -m "msg"
# or
cgit to dev -m "msg" -no-mp
# or
git add .
git commit -m "msg"
git checkout dev
```


> 参数
### 参数

#### -t
cgit to -t [?date|l+1|m+1|s+1] -tag [customTag]
cgit to -t 按配置文件来 

##### -t -tag
如果 命令行 -t -tag branchName
表示使用传入的branchName作为tag


> 如果你使用cgit to 来运行，您需要一个配置文件来定义那些分支上需要打tag
##### tag.test
需要匹配的分支   在这个分支才能推送tag到远程

##### tag.mode 
date=>日期式tag  version=》版本式tag  

##### tag.type
'YYYY.DD.MM' 日期式tag的一个例子  'YY-MM/dd'
YYYY => 4位年 2020
YY 年份后两位 20
MM 2位月份 少于2位补零  06
M 月份 不补零    6
DD 2位日期 少于2位补零  2
D 日期 不补零  02

若原版本号是v1.0.0
l+1 大版本+1   => v2.0.0
m+1 => v1.1.0
s+1 => v1.0.1
s+5 => v1.0.5

##### tag.use
配置里如果有use（expression|function）  那么他的返回值将作为tag

#### tag.prefix
prefix 版本号前缀, 默认 v


### -b -m
-b 明确表示分支，如果没有会提取命令行的第三个参数，如果没有第三个参数会当成当前分支
-m 提交信息

```sh
# 保存信息提交到当前分支
cgit to -m "update"
# 保存信息提交到uat分支
cgit to uat -m "update"
# 保存信息提交到branch分支
cgit to -m "" -b branch
```


### cgit tag
#### 参数 -l
建议推送分支

#### 参数 -mode -type
mode => date | version 内置的两种版本提交方式
type => 两种提交方式的具体类型

#### 参数 -tag
自定义的tag

#### 参数 -p
推送到远程
或者
```sh
cgit tag push -tag helo
cgit tag push -mode date -type YY.MM/DD
cgit tag -l
cgit tag -mode version -type m+1 # 只是创建tag

cgit tag -mode version -type m+1 -m "msg"
```


## cgit checkout xx -m "xxx"
只是保存本地分支信息并切换到xx分支, 若有对应的远程分支，则拉取最新代码 


### 配置文件例子
hook暂时只有merge pull push 对应的before，after阶段

```js
module.exports = {
	hook: {
		beforeMerge: {
			only: ['uat', 'pro'],
			fn: ()=> {
				console.log('hello');
			}
		},
		afterPush: {
			exclude: ['master'],
			fn: ({from, to})=> {
				console.log(from, to);
			}
		},
		beforePull: {
			only: /feature\/.*/,
			fn: (e)=> {
				console.log(e);
			}
		}
	},
	tag: [
		{
			test: /pro\d/, // 匹配的分支名称
			mode: 'l+1', // data 采用日期 | version 采用版本 如1.0.0(大版本.中版本.小版本)
			type: 'MM.dd',
			// YYYY=> 四位数的年，YY=>年份后两位，MM=>两位月份少于两位补零， M,月份不补零，
			// DD日期，补零，D 日期，不补零 不区分大小写,避免误伤，尽量不要把字母作为分隔符
			// l+1大版本+1 | m+1中版本+1 |  s+1 小版本+1 （默认）

			prefix: 'v', // 默认 如果设置了别的值如version 则规则会从头开始version1.0.0
			// use: ()=> { // 如果有use 优先级高于前面
			// 	return 'v1.0.1'
			// }
		}
	]
}
```