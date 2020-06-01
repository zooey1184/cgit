# cgit 集成git命令行
#### tag
cgit auto -t [?date|l+1|m+1|s+1] -tag [customTag]
cgit auto -t 按配置文件来 

##### tag
如果 命令行 -t -tag hello
表示使用传入的hello作为tag

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

##### tag.test
需要匹配的分支   在这个分支才能推送tag到远程


prefix 版本号前缀默认v


cgit auto -m "update"

cgit auto uat -m "update"

cgit auto -m "" -b branch




