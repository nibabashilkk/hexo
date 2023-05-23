---
title: OpenAI最新的实验项目——AutoGPT，来了
date: 2023-04-13 20:53:04
tags:
  - 原创
  - chatgpt
categories:
  - 技术分享
id: 20230413a
cover: https://cdn.xiaoliu.life/tc/20230413a/cover.webp
---

今天**Auto-GPT**又爆火了，它是OpenAl的一个新的项目。

顾名思义，根据它的名字就可以看出它最大的卖点是什么——**Auto**。你只需要给它一个任务，不需要关心任何（有点夸张了）细节，剩下的它会自动帮你完成，有没有一种未来人工智能的感觉。

简单来说，它会自动“思考“，你给它一个任务，它会想怎么才能完成，如何才能完成好，怎么才能完成更好，等等。

光听可能对这个概念不是完全理解，你可以自己部署一个玩玩。

### 部署

如果没有满足下面两个条件的话，之后可以不用看了

> 1. 有openAI的个人key
> 2. 有个国外的服务器

#### 个人key

这个可以去openAI官网申请，就是注册的时候需要国外的手机号有点麻烦。

网上有很多教程，就不重复造轮子了。

新注册用户有五美元的免费额度，个人使用的话还是能用很长时间的，就是不知道现在还有没有。

#### 国外的服务器

本质上还是调用chatgpt的接口，但是自从gpt-3以后，在国内就不能调用它的接口了，需要魔法才可以。

因此，虽然官网上说支持windows和mac部署（想着可以在自己电脑上玩了），但是部署完后根本访问不了。同理，国内的服务器也不行，一定要是国外的服务器，差不多2核2G就够了。

#### AutoGPT

github项目地址：[GitHub - Torantulino/Auto-GPT: An experimental open-source attempt to make GPT-4 fully autonomous.](https://github.com/Torantulino/Auto-GPT)

需要3.8及以上的python环境，github上有还算详细的部署教程，除了不是图文形式的。

![](https://cdn.xiaoliu.life/tc/20230413a/1.webp)

需要的话周末我会出一篇部署教程。