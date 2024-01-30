# LuckyDraw 年会抽奖页面

### 感谢@gavinjzx（阿提）贡献代码，我Fork出来做一些改动。

## 使用环境

因为使用了css3 animation，所以建议使用chrome,firefox,IE10及以上（IE9及以下不支持css3 animation）。

## 使用方法

双击index.html打开浏览器网页即可使用。

网页分中奖榜单、抽奖池、摇奖按钮、配置按钮

首先点击配置，设置好对应奖品的数量，然后选择员工名单。员工名单的格式需要参考test.xlsx，第一行的工号、姓名、部门不能修改。

点击应用，确定，设置好配置，此时抽奖的前置准备工作完毕。

点击开始按钮，抽奖池会进行跳动显示，点击停止，中奖人员会进入中奖榜单，抽奖顺序按照三等奖、二等奖、一等奖的顺序进行。

当全部奖品数量抽完，此时抽奖结束，不能继续抽奖。

可以通过重新加载配置，重新开启摇奖。

## 打包方法

打包index.html、css文件夹、js文件夹即可

## 代码结构

调用库：
js:jquery,xlsx
css:animation

文件结构：

\index.html              抽奖主界面

\js\index.js             JS主程序

\js\lib\jquery-1.12.4.min.js    jQuery文件

\js\lib\common.js        一些公用函数

\css\animate.css        css3 animation库

\css\style.less            样式Less文件

\css\widget\*.less        style.less引用的less文件

\css\img\            页面上所用到的图标文件

\asserts              素材页，打包不需要加入
