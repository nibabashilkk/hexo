---
title: mysql导入不同文件格式的数据
tags: []
id: '20221217a'
categories:
  - - 技术分享
comments: false
date: 2022-12-17 18:24:56
---

记录一下mysql数据库导入不同格式数据的问题。

最近正在借鉴别人的网站（读书人的东西怎么能叫抄呢），需要把数据一点点导入到我自己的数据库中。一开始觉得数据挺少的，就一行行敲sql命令一点点导入，后来实在觉得太慢了，好歹也是个半吊子程序员，手动导入也太降低逼格了。

于是就写了爬虫（人生苦短，快学python）爬来了想要的数据，保存到文件里，再用mysql自带的导入功能，把数据导入到我的表里。

爬数据就不说了，讲一下几种导入外部数据的方法。

#### .sql文件

这种文件格式之前说过，导入比较简单

```shell
mysql -u root -p wordpress < /usr/local/wordpress.sql #这句意思是把wordpress.sql文件导入到wordpress数据库中
```

只需要一句命令即可导入成功。

#### .txt文件

这种即是普通的文件格式，linux下加不加文件后缀都一样。

假设文件格式是下面这种情况

```txt
3,智影,腾讯出品在线智能视频创作平台,https://zenvideo.qq.com/home
4,极简简历,简单优质的在线简历制作平台,https://www.polebrief.com/index
5,白描OCR,白描OCR网页版、图片文字提取、PDF转文字,https://web.baimiaoapp.com/
6,PDF 在线工具箱,支持24种PDF在线编辑功能,https://tools.pdf24.org/zh/
7,树图思维导图,免费的在线思维导图工具网站,https://shutu.cn/
8,网易见外工作台,网易自营的智能转写翻译服务,https://jianwai.youdao.com/
```

每个字段都是以','分开，当然也可以使用其他分隔符进行分开，分隔符最好是你数据里没有出现的。

使用下面命令即可导入到数据库里的一个表中。

```txt
load data local infile "/home/date" into table workonline FIELDS TERMINATED BY ',';
此命令含义是把/home/data里面的数据导入到当前数据库里的workonline表里，每个字段以‘,’分开
```

