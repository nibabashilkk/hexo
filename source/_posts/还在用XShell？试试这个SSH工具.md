---
title: 还在用XShell？试试这个SSH工具
date: 2023-01-06 20:36:39
tags: 
  - 原创
  - ssh工具
id: "20230106a"
categories:
  - 日常推荐
cover: https://cdn.xiaoliu.life/tc/20230106a/cover.png
---

今天看同事用的连接服务器的工具界面挺好看的，问了下工具名称——<code>Termius</code>。

当我向他介绍了我的<code>xshell</code>后，他一脸惊讶的问我，“你不知道他有漏洞？？？”。

不说了，已经把电脑上的xshell卸载了。

### 使用感受

#### 界面

![](https://cdn.xiaoliu.life/tc/20230106a/屏幕截图-2023-01-06-195855.jpg)

确实比xshell好看多了，界面十分简洁，而且有多种主题供你选择~~健康绿就不错~~。

可以在**设置**—>**Terminal**修改主题配色和字体颜色等等，总有一种你会喜欢。真的强推一波绿色，很适合你的~~狗头~~。

![](https://cdn.xiaoliu.life/tc/20230106a/屏幕截图-2023-01-06-200549.jpg)

#### 功能

对标于xshell，首先在支持的平台上就已经完胜它了。

xshell只支持在windows上面使用，Termius几乎支持目前所有的平台，包括windows/macOS/iOS/Android/Linux。

对我来说功能基本差不多，因为我只连服务器，xshell专业版好像有挺多功能的，但对我来说形同虚设，根本用不到。不过xshell不支持文件传输，得下个xftp才能传文件；Termius自带SFTP，这点就非常深得我意，实在懒得管理太多软件，最好一个软件能满足我所有的需求~~想屁吃~~。

Termius使用时需要登录，之后所有支持的平台都可以用这个账号，不同平台之间保存原有的ssh密钥（即连接时不需要再次输ip和密码了）。

说实话，总是很担心这个功能会有泄密的风险。

### 使用

![](https://cdn.xiaoliu.life/tc/20230106a/屏幕截图-2023-01-06-202119.jpg)

安装完后注册个账号即可，也可以使用apple登录或者google账号登录，不过那俩打开有点慢，建议还是注册个账号登吧。

![](https://cdn.xiaoliu.life/tc/20230106a/屏幕截图-2023-01-06-202344.jpg)

登录后就可以连接服务器了，按照上图新建个host。

![](https://cdn.xiaoliu.life/tc/20230106a/屏幕截图-2023-01-06-202553.jpg)

文件传输功能，把想要上传的文件拉到右边即可。

#### 下载

官网：https://termux.dev/en/

windows版：https://www.termius.com/windows

