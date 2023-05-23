---
title: Chat GPT Next，轻松打造智能聊天机器人
date: 2023-05-08 21:00:42
tags:
  - 原创
  - chatgpt
categories:
  - 技术分享
id: 20230508a
cover: https://cdn.xiaoliu.life/tc/20230508a/cover.webp
---

今天推荐一个很好用的github项目——**ChatGPT-Next-Web**。如果你之前觉得麻烦，没有部署**AutoGPT**，那么你可以试试这个。完全不需要任何服务器，只需一键点击即刻部署完成。

下面介绍下怎么使用吧。

### 项目部署

官网：[Yidadaa/ChatGPT-Next-Web: One-Click to deploy well-designed ChatGPT web UI on Vercel. 一键拥有你自己的 ChatGPT 网页服务。 (github.com)](https://github.com/Yidadaa/ChatGPT-Next-Web)

感兴趣的可以看看代码，找找是否有隐藏的后门。如果不感兴趣直接拉到**Get Started**。

部署前提：

> 1. OpenAI API Key：这个申请流程不用多说，需要自己去官网申请，新人有五美元的免费额度。
>
> 2. 有一个github账号，等会部署的时候会用到。

![](https://cdn.xiaoliu.life/tc/20230508a/1.webp)

找到这个**deploy**按钮，会跳转到**Vercel**，在那上面部署你的应用。

不超过额度的话就是免费的，请放心食用~~

进去后需要你自己登录，这就不多说了，建议使用**github账号**登录。

![](https://cdn.xiaoliu.life/tc/20230508a/2.webp)

这里使用第一个github，如果之前没有克隆这个项目到你自己仓库里话会提示你先克隆。之后的话就会自动选择那个项目。

![](https://cdn.xiaoliu.life/tc/20230508a/3.webp)

之后在下面配置好参数即可部署了。

![](https://cdn.xiaoliu.life/tc/20230508a/4.webp)

这两个参数分别是你的**ApiKey**和**使用密码**，这个密码最好配一个复杂点的。因为默认项目是使用你的key，配置上密码后可以防止别人使用。

之后就等待部署完成吧。

### 使用

恭喜！！！看到下面界面即代表你已经部署完成了。

![](https://cdn.xiaoliu.life/tc/20230508a/5.webp)

建议去控制台加上自定义的域名，因为它提供的域名大部分由于国内原因，DNS已经被污染，在国内根本访问不到。

![](https://cdn.xiaoliu.life/tc/20230508a/6.webp)

第一个是我的二级域名，在腾讯云买的（不是广告）。下面那个是初始自带的，试过了根本不行。

域名搞完成后就可以通过那个域名进行访问了，希望玩的愉快~~

![](https://cdn.xiaoliu.life/tc/20230508a/7.webp)

这就是最终成品！！！

### 后记

这是我部署的，欢迎访问：[ChatGPT Next Web (xiaoliu.life)](https://chatgpt.xiaoliu.life/)

另外建议使用自己的**ApiKey**，因为我实在没余额了。

![](https://cdn.xiaoliu.life/tc/20230508a/8.webp)

根据上图点击设置后就可以使用自己的**APIkey**进行玩耍了。

没错，本文标题是chatgpt取的๑乛◡乛๑