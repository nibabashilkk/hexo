---
title: centos安装docker和docker-compose完整版
date: 2023-06-13 16:33:07
tags:
  - docker安装
  - docker-compose安装
id: 20230613a
cover: https://cdn.xiaoliu.life/tc/20230613a/cover.webp
---

之前写过一篇介绍怎么安装**docker**和**docker-compose**的文章，但是由于centos的安装源比较老，每次安装的docker和docker-compose都是老版本的。今天这篇文章详细介绍下如何在centos上安装你想要版本的docker。

话不多说，开整！！！

## 安装docker

更新yum

```shell
yum update
```

安装配置时的依赖包

```shell
yum install -y yum-utils device-mapper-persistent-data lvm2
```

配置阿里云的yum源

```shell
yum-config-manager --add-repo https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
```

查看仓库中所有的**dcoker**版本

```shell
yum list docker-ce --showduplicates | sort -r
```

![](https://cdn.xiaoliu.life/tc/20230613a/1.webp)

默认使用**yum install docker-ce**安装最新版的docker，当然也可以指定安装特定的版本

```shell
yum install docker-ce-24.0* -y
```

验证是否安装成功

```shell
docker --version
```

## 安装docker-compose

国外源安装

```shell
curl -SL https://github.com/docker/compose/releases/download/v2.17.2/docker-compose-linux-x86_64 -o /usr/local/bin/docker-compose
```

国内源安装

```shell
curl -SL https://get.daocloud.io/docker/compose/releases/download/v2.17.2/docker-compose-linux-x86_64 -o /usr/local/bin/docker-compose
```

赋予可执行权限

```shell
chmod +x /usr/local/bin/docker-compose
```

验证是否安装成功

```shell
docker compose version
```

