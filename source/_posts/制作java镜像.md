---
title: 制作java镜像
date: 2023-05-22 17:45:29
tags:
  - 原创
  - java
categories:
  - 20230522a
id: 20230522a
cover: https://cdn.xiaoliu.life/tc/20230522a/cover.webp
---

使用docker build制作项目的docker镜像。

## 项目打包

介绍下linux环境下项目打包。

### 拉取代码

首先从git上拉取项目代码，在项目目录下执行下面命令对java项目打包。

```shell
mvn clean package
```

服务器上没有mvn的话，可以参考这个链接[(2条消息) 在Linux系统中安装并配置maven详细教程_apache-maven-3.1.1-bin.tar.gz_zxf0619的博客-CSDN博客](https://blog.csdn.net/zxf0619/article/details/121478813)。

### 制作镜像

编写Dockerfile文件，制作程序镜像。

```yaml
FROM openjdk:17-slim
ADD ./target/rest-1.0-SNAPSHOT.jar //
EXPOSE 8081
ENTRYPOINT ["sh","-c","java -jar rest-1.0-SNAPSHOT.jar"]
```

基础镜像使用**openjdk**的java17，把打包好的程序jar包放到镜像里面同时启动jar包。

**FROM**：指定的基础镜像名称，如果没有基础镜像，可以写成**FROM scratch**。

**ADD**：把指定文件复制到镜像的某个路径下。

**MAINTAINER**：指定镜像作者。

**EXPOSE**：暴露容器运行时的监听端口。

**ENV**：设置环境变量。

**ENTRYPOINT**：镜像启动时执行的命令。

此时**Dockerfile**文件编写完成后就可以通过下面命令来制作镜像

```shell
docker build -t 镜像名 .
```

**.**代表从当前路径下找Dockerfile文件。

制作镜像完成后可以使用**docker images**查看本机所有的镜像。

### 镜像打包

通常一个项目会有多个docker服务构成，那么我们可以把他们全都打成一个tar包。

比如现在有三个服务，分别是**blog:latest**，**redis:latest**和**postgres:latest**。那么我们就可以使用下面这个命令把他们三个打成一个tar包。

```shell
docker save -o image.tar blog:latest redis:latest pogres:latest
```

这个命令是把那三个镜像放在一起打成一个**image.tar**包，方便部署。

部署的时候同样可以直接把三个都解出来。

```shell
docker load
```

