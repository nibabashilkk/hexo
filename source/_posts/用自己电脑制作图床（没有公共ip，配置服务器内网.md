---
title: 用自己电脑制作图床（没有公共ip，配置服务器内网穿透）
tags:
  - frp教程
  - 原创
  - 图床教程
  - 服务器
id: '20221121a'
categories:
  - - 技术分享
date: 2022-11-21 20:59:46
---

正所谓需求产生动力，今天分享一下如何做一个内网穿透服务器。

##### 原因

之前用国外免费的github cdn服务访问在github上存的图片。俗话说，免费的就是最贵的。

用那个加速的话，页面访问贼慢，图片经常很长时间都出不来，云服务器空间又太小（没钱，只能买配置最低的服务器）。

买的国外vultr服务器每月有1000G，自从把网站迁到阿里云后，那个服务器就没用过了，所以就想着做成frp的内网穿透服务器（自己电脑的http服务需要做内网穿透才能让别人访问），主要用来访问本机的图片。

##### 配置frp服务器

可以去[https://github.com/fatedier/frp/releases](https://github.com/fatedier/frp/releases)网站下载最新的frp包。最新的应该是这个版本。

![屏幕截图 2022-11-21 202519](https://cdn.xiaoliu.life/tc/20221121a/屏幕截图-2022-11-21-202519.jpg)

centos服务器选择圈主的那个版本下载，下载完成后传到服务器即可。

当然也可以在服务器用wegt命令下载。

```shell
wget https://github.com/fatedier/frp/releases/download/v0.45.0/frp_0.45.0_linux_amd64.tar.gz
```

下载完直接在当前目录解压即可。

```shell
tar -zxvf frp_0.45.0_linux_amd64.tar.gz
```

可以看到解压的目录下有几个文件

![屏幕截图 2022-11-21 203031](https://cdn.xiaoliu.life/tc/20221121a/屏幕截图-2022-11-21-203031.jpg)

根据名字不难看出，分别是服务器端用的和客户端用的。

服务器端主要更改frps.ini这个文件。如果只用http服务的话可以复制下面的代码到frps.ini文件里。

```txt
[common]
bind_addr = 0.0.0.0 #服务器端ip地址，0.0.0.0就代表本机地址
bind_port = 7000 #服务器端的监听端口
vhost_http_port = 8088 #客户端http服务的端口，我理解是这样的
```

就陪上面三个就可以了，其他不用多搞，已经可以使用了。

启动frp服务

```shell
./frps -c ./frps.ini
```

像下图一样就启动成功了

![屏幕截图 2022-11-21 203535](https://cdn.xiaoliu.life/tc/20221121a/屏幕截图-2022-11-21-203535.jpg)

由于是脚本文件启动的，关闭终端后服务就会自动停止，最简单的方法是用nohup命令让他一直运行，也可以弄成系统服务，自己探索吧，我用的nohup。

##### 配置客户端

我的笔记本是windows操作系统，所以用的windos的包

![屏幕截图 2022-11-21 203840](https://cdn.xiaoliu.life/tc/20221121a/屏幕截图-2022-11-21-203840.jpg)

整个文件和服务端的差不多。

![屏幕截图 2022-11-21 204010](https://cdn.xiaoliu.life/tc/20221121a/屏幕截图-2022-11-21-204010.jpg)

客户端需要修改的文件是frpc.ini。配置可以根据下面那样写。

```txt
[common]
server_addr = ***** #你服务器的ip地址
server_port = 7000 #你服务器监听的端口
​
[http]
type = http
local_ip = 127.0.0.1
local_port = 80 #本地http服务端口
remote_port = 80 #访问端口，和上面写的一样就可以
custom_domains = web01.yourdomain.com #配置完成后用这个域名就可以访问到了
```

启动客户端

```shell
frpc.exe -c frpc.ini
```

要用cmd界面启动。

![屏幕截图 2022-11-21 204611](https://cdn.xiaoliu.life/tc/20221121a/屏幕截图-2022-11-21-204611.jpg)

之后用你上面配置的域名就可以访问到内网的web服务了。当然，首先你在你内网机上已经配置好web服务了（比如你自己的网站）。