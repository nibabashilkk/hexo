---
title: hexo安装教程——做一个导航网站
tags:
  - hexo
  - wordpress
  - 建站
id: '20221223a'
categories:
  - - 技术分享
date: 2022-12-23 20:17:20
---

静态博客hexo搭建，相较于wordpress，hexo具有搭建迅速，部署方便（可以直接部署到github或其他国内代码托管平台，完全不需要任何服务器费用），反应迅速（wordpress加载时需要从数据库中取数据，有了个查询的时间）等优点。

由于需要搭个导航类的网站，又没有钱再租一个服务器了，就打算用gitee托管建网站了。

本次是在windows上安装，用的hexo主题是webstack。

**步骤**

> 1.  安装node.js
> 2.  安装hexo
> 3.  用webstack主题搭建
> 4.  部署到github上

#### 安装node.js

node.js官网：[](https://nodejs.org/en/)[https://nodejs.org/en/](https://nodejs.org/en/)

![屏幕截图 2022-12-23 185131](https://cdn.xiaoliu.life/tc/20221223a/屏幕截图-2022-12-23-185131.jpg)

建议安装18.12.1 LTS版本，这个是长久支持的，虽然我也不知道两个有什么区别。

按照下载的引导工具进行安装，直至安装完成。

![屏幕截图 2022-12-23 185229](https://cdn.xiaoliu.life/tc/20221223a/屏幕截图-2022-12-23-185229.jpg)

在命令行界面输入以下命令查看是否安装成功。

```powershell
npm -v
node -v
```

![屏幕截图 2022-12-23 192656](https://cdn.xiaoliu.life/tc/20221223a/屏幕截图-2022-12-23-192656.jpg)

出现版本即安装成功。

安装成功后最好换一下npm的下载源，换成国内淘宝的镜像源

```powershell
npm config set registry "https://registry.npm.taobao.org"
```

#### 安装hexo

```powershell
npm install hexo-cli -g
```

输入上面命令，等待安装成功后验证hexo安装

```powershell
hexo -v
```

出现下面版本信息即安装成功

![屏幕截图 2022-12-23 193102](https://cdn.xiaoliu.life/tc/20221223a/屏幕截图-2022-12-23-193102.jpg)

最好新建一个新的文件夹用来放整个项目文件。

我的项目路径C:\\hexo\\nav。

命令行进入项目路径，在当前路径下输入以下命令。

```powershell
hexo init
```

![屏幕截图 2022-12-23 193506](https://cdn.xiaoliu.life/tc/20221223a/屏幕截图-2022-12-23-193506.jpg)

出现Start blogging with Hexo!时，恭喜你，已经搭建成功了。

```powershell
hexo s
```

此命令用于预览本地主题的，输入后之后在浏览器访问[http://127.0.0.1:4000](http://127.0.0.1:4000)即可访问当前默认主题了。

![屏幕截图 2022-12-23 194141](https://cdn.xiaoliu.life/tc/20221223a/屏幕截图-2022-12-23-194141.jpg)

#### 换成webstack主题

找了半天，发现hexo只有这一个导航主题（还是上一年更新的），凑合着用了。

电脑没装git，就直接去github上把主题下下来了。

主题网址：[](https://github.com/HCLonely/hexo-theme-webstack)[https://github.com/HCLonely/hexo-theme-webstack](https://github.com/HCLonely/hexo-theme-webstack)

解压到themes文件夹下即可

![屏幕截图 2022-12-23 195113](https://cdn.xiaoliu.life/tc/20221223a/屏幕截图-2022-12-23-195113.jpg)

修改\_config.yml文件，把主题换成webstack。

![屏幕截图 2022-12-23 195350](https://cdn.xiaoliu.life/tc/20221223a/屏幕截图-2022-12-23-195350.jpg)

找到themes文件夹下webstack主题下的.yml文件复制到项目文件下并把名字改成\_config.webstack.yml。

命令行启动预览主题

![屏幕截图 2022-12-23 195918](https://cdn.xiaoliu.life/tc/20221223a/屏幕截图-2022-12-23-195918.jpg)

成功，剩下就是按照作者手册美化了。

#### 部署到github上

最好下个git吧，具体过程不介绍了，因为我还没弄<(￣︶￣)>

部署到github上的话，你的域名应该是https://你的仓库.github.io，所以要修改\_config.yml文件，改域名。

![屏幕截图 2022-12-23 200256](https://cdn.xiaoliu.life/tc/20221223a/屏幕截图-2022-12-23-200256.jpg)

呐，作者也给提示了，如果域名修改不对的话，就不能引用到js和其他文件，导致你本地预览的样式和实际访问的网站样式不一样。

当然，hexo不仅仅能做导航，用来搭建个人网站还是挺不错的，一些主题挺好看的，而且二次开发也比较简单。

就是没有自己的数据库，一些评论或者其他东西要经过第三方来实现，要是别人跑路了就难受了。