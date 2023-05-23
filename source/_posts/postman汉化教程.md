---
title: postman汉化教程
date: 2023-03-07 21:14:26
tags:
  - 原创
categories:
  - 日常推荐
id: 20230307a
cover: https://cdn.xiaoliu.life/tc/20230307a/cover.webp
---

不知道怎么回事，从java8升级到java17后原来项目的swagger就用不了一直报错误。在网上找了很久都没有解决，唯一一个能用的方法是——不用swagger~~真是天才的想法，我怎么没想到呢~~。

tmd，怎么好意思把这发到网上的，最主要是百度排名还不低。

最终也没解决，也就放弃了，投入了**Postman**的怀抱。

postman全体是英文的，自认为英语水平一般，于是就有了这期的postman汉化教程。

### 下载汉化包

肯定会有人疑惑，为什么不先下载postman呢？

一开始我就踩了这坑，先下载了它，最新版的postman。到后来发现汉化插件目前只支持**9.12.2**，不得已重新下载。

汉化包官网：[Releases · hlmd/Postman-cn (github.com)](https://github.com/hlmd/Postman-cn/releases)

![](https://cdn.xiaoliu.life/tc/20230307a/1.webp)

根据最新支持的版本去下载相应版本的postman，这里我就下载9.12.2版的了。

### postman下载

在官网没找到往期版本的postman下载路径，在一个别的博客找到了下载路径。

| 历史版本    | 链接                                              |
| ----------- | ------------------------------------------------- |
| windows64位 | https://dl.pstmn.io/download/version/版本号/win64 |
| windows32位 | https://dl.pstmn.io/download/version/版本号/win32 |

替换成你想要下载的版本号。

比如下载9.12.2版：  https://dl.pstmn.io/download/version/9.12.2/win64

### 汉化

把下载好的汉化插件解压到postman安装路径下的resources文件夹内

我放的路径：

```shell
C:\Users\14495\AppData\Local\Postman\app-9.12.2\resources
```

![](https://cdn.xiaoliu.life/tc/20230307a/2.webp)

重新打开postman就汉化成功了。

![](https://cdn.xiaoliu.life/tc/20230307a/3.webp)

如果汉化失败可能是汉化插件解压的时候里面嵌套了一层，即**app文件夹内还有个app文件夹**。

把里面的app文件夹放到外面即可。

