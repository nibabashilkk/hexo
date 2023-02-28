---
title: docker简解
date: 2023-01-12 21:00:48
tags:
  - docker
id: 20230112a
categories:
  - 技术分享
cover: https://cdn.xiaoliu.life/tc/20230112a/cover.png
---

刚刚接触到<code>docker</code>，分享下自己的理解吧，有错误多指教。

不少人肯定很好奇都有了虚拟机，为什么还要docker呢~~一开始我就认为它俩差不多~~。

### docker与虚拟机的区别

<code>docker</code>直接与宿主机建立联系，用的都是宿主机的资源，其和你电脑上的软件本质上都一样，只不过

利用**namespace**将它与电脑上其他软件隔离起来，从而实现影响不了宿主机。

<code>虚拟机</code>是在原有的宿主机上虚拟出来网卡、cpu、内存，再在这上面建立虚拟机，相当于没有直接与宿主机交互。

#### 二者优劣

docker就是快凸(艹皿艹 )，因为直接用宿主机的硬件，docker启动速度比虚拟机快多了，而且利用率也比虚拟机高；docker的兼容性也比虚拟机好，像vm只能在windows上运行，docker基本上能在全平台上运行（真是应用迁移神器啊）。

说个题外话，之前在网上看到个段子。

程序员写完代码并自测完成后，提交给测试；测试按照步骤一步步安装完后，发现程序运行不起来，程序员就很无辜的说，在我机器上就可以运行的啊（惊讶脸），肯定是你环境的问题。

现在有了docker，程序员再也推卸不了责任了(￣ε(#￣)☆╰╮o(￣皿￣///)。

### docker构成

docker主要有五部分构成~~我感觉就三个~~。

> 1. Docker镜像（Images）
> 2. Docker容器（Container）
> 3. Docker客户端（Client）
> 4. Docker主机（Host）
> 5. Docker Registry

#### Images

实际上就是个模板，只能读，容器就是根据镜像来生成的~~暂时就这样理解的，错了之后再改~~。

#### Container

容器，相当于一个进程，只不过这个进程不能让别人感知，它也感知不到别的进程。

是镜像的运行状态，可以启动、删除，同样，容器之间也是互相隔离的。

#### 仓库

用来存放镜像的仓库，有公有仓库和私有仓库，可以自己建个。

### Docker相关

#### 安装

灰常简单，直接

```shell
yum install docker
yum install docker-compose ##管理docker的，可装可不装
```

#### 常用命令

```shell
docker pull ###拉取镜像
docker images ###查看下载了哪些镜像
docker build ###创建镜像
docker push ###上传镜像
docker create ###创建容器
docker start ###启动容器
docker exec ###进入容器
docker rm ###删除容器
docker ps -a ###查看当前启动了哪些容器
```

