---
title: 微软New Bing初体验
date: 2023-02-25 20:01:21
tags:
  - 原创
  - AI
categories:
  - 技术分享
id: 20230225a
cover: https://cdn.xiaoliu.life/tc/20230225a/cover.webp
---

距离上次申请**New Bing**教程才过三天，今天下午邮箱就收到了微软发的邮件，成功拿到了**New Bing**的测试资格。

![](https://cdn.xiaoliu.life/tc/20230225a/1.webp)

有了资格但是在国内使用的话还是有诸多限制，现在我电脑就算“出去”后也访问不到了，总是给我重定向到老的Bing，手机的话还可以打开，不知道怎么回事。

不过在网上看到了另一个方法——插件。我为我前几天的口出狂言道歉，竟然会觉得插件不好用。

插件原理是修改请求头，规避掉国内重定向规则。

### 插件使用

用插件的话是不需要“出去”的，最好使用**Edge**浏览器，别问为什么，问就是我用的这个((٩(//̀Д/́/)۶))。

插件地址：[Header Editor - Microsoft Edge Addons](https://microsoftedge.microsoft.com/addons/detail/header-editor/afopnekiinpekooejpchnkgfffaeceko)

![](https://cdn.xiaoliu.life/tc/20230225a/2.webp)

安装好后新建一个匹配规则，按照下图的配置把这几项填好即可。

```powershell
// 匹配规则
^http(s?)://(.*).bing\.com/(.*)

// 头名称
x-forwarded-for

// 头内容
8.8.8.8
```

![](https://cdn.xiaoliu.life/tc/20230225a/3.webp)

右下角有个添加规则的，电脑屏幕大的话确实很难看见~~第一次确实没看到~~。

![](https://cdn.xiaoliu.life/tc/20230225a/4.webp)

按照上图填好就行了，非常简单，保存规则后访问**New Bing**官网就可以使用了。

### New Bing使用

New Bing官网：[新必应 - 了解详细信息 (bing.com)](https://www.bing.com/new)

![](https://cdn.xiaoliu.life/tc/20230225a/5.webp)

会跳转到**New Bing**官网，点击**聊天**就可以和AI聊天了。

![](https://cdn.xiaoliu.life/tc/20230225a/6.webp)

可以在对话框里像AI提一些奇奇怪怪的问题。

![](https://cdn.xiaoliu.life/tc/20230225a/7.webp)

我觉得还需要再训练训练，一点都不懂得人情世故(╯#-_-)╯~~~~~~~~~~~~~~~~~╧═╧。