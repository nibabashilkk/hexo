---
title: AutoGPT部署教程
date: 2023-04-16 19:18:36
tags:
  - 原创
  - 服务器
categories:
  - 技术分享
id: 20230416a
cover: https://cdn.xiaoliu.life/tc/20230416a/cover.webp
---

今天介绍下如何部署**Auto-GPT**，官网已经写的很好了，分享下我的部署过程和踩到的坑。

### 拉取代码

github仓库：[GitHub - Significant-Gravitas/Auto-GPT: An experimental open-source attempt to make GPT-4 fully autonomous.](https://github.com/Significant-Gravitas/Auto-GPT)

推荐使用git直接拉取仓库下来，当然服务器没装git的话也可以下载zip压缩包解压到服务器上。

```shell
yum install git ##安装git
```

### 部署

它推荐了两种方式部署吧，一种是用python安装好依赖再运行，另一种是打成个镜像再运行。

本次就选用打包成镜像部署，这个简单点。

切记使用国外的服务器！！！切记使用国外的服务器！！！切记使用国外的服务器！！！

#### 修改.env环境

整个项目文件结构如下所示

![](https://cdn.xiaoliu.life/tc/20230416a/1.webp)

需要把这个**.env.template**名字改成**.env**或者新建个**.env**文件，把里面的内容复制过来，方便改错了再修改回来。

这个**.env**文件里主要修改两个部分——**你自己的key**和**redis配置**。

![](https://cdn.xiaoliu.life/tc/20230416a/2.webp)

这个改成自己的**key**即可。

![](https://cdn.xiaoliu.life/tc/20230416a/3.webp)

**REDIS_HOST**：redis服务器地址

**REDIS_PORT**：redis端口

**REDIS_PASSWORD**：密码（默认没有密码）

这些resid配置不需要改，镜像部署redis时指定映射端口即可。

### 打Auto-GPT镜像

如果服务器没有docker请先安装docker。

```shell
yum install docker
```

虽然版本可能有点低，但是够用了。

进入到项目路径，可以看到**Dockerfile**文件，在此路径下打镜像。

![](https://cdn.xiaoliu.life/tc/20230416a/4.webp)

执行下面命令

```shell
docker build -t autogpt .
```

执行完后可以使用下面命令查看是否镜像打成功。

```shell
docker images
```

### 安装redis

虽然这个项目下有个**docker-compose.yml**，可以直接拉取redis并运行，但是实际使用时不知道是不是docker版本太低了，总是报错，懒得升级docker了就手动拉镜像然后启动了。

```shell
docker pull redis:latest ##拉取最新redis镜像
docker run -d --name redis:latest -p 6379:6379 redis ##启动镜像
```

### 启动Auto-GPT

现在就可以启动了，启动之前别忘了修改**.env**文件里的参数，现在只需要加上你自己的**apikey**就行了。

执行下面命令启动

```shell
docker run -it --env-file=./.env -v $PWD/auto_gpt_workspace:/app/auto_gpt_workspace autogpt
```

讲一下参数吧

**--env-file**：放着环境参数的文件，就是**.env**文件的路径。

**-v**：容器内外挂载的文件夹路径，建议修改成自己想修改的路径（文件夹必须存在）

### 使用

上面命令执行完后就会进入到命令行界面了。

![](https://cdn.xiaoliu.life/tc/20230416a/5.webp)

可以设置AI的名字，身份和你想要他执行的任务，之后可以对话让他执行任务了。

![](https://cdn.xiaoliu.life/tc/20230416a/6.webp)

不知道是不是不支持中文，有时候答案会解析不出来。

如果出现错误的话百分之九十是输入法的问题，建议把问题复制出来再输一遍。