---
title: 记录一下wordpress网站迁移遇到的问题
tags:
  - wordpress
  - 原创
id: '20221103b'
categories:
  - - 技术分享
date: 2022-11-03 22:12:50
---

不知道是我买的阿里云服务器太垃圾还是他本来就容易被攻击，服务器经常cpu跑满导致网站正常访问失败。

昨天实在受不了了，又买了一年的腾讯服务器，把网站迁移到腾讯云上去了。

在此记录下迁移网站时遇到的“坑”。

众所周知，迁移网站一共两步

> 1.  备份迁移数据库
> 2.  备份迁移网站

#### 迁移数据库

迁移数据库还是不难的，xshell连上服务器命令行导出数据库即可，比如导出wordpress数据库。

进入到mysql的bin路径下并运行mysqldump

```shell
mysqldump -u 用户名 -p 数据库名 > 导出的文件名
例如：mysqldump -u root -p wordpress >wordpress.sql
一开始不用输root用户的密码，执行完上面命令后会提示你输密码
```

之后把.sql文件导入到新服务器的mysql数据库中

首先要进入到mysql中

```shell
mysql -u root -p #同样不需要输入密码，点击回车后会提示输root用户的密码
mysql -u root -p wordpress < /usr/local/wordpress.sql #这句意思是把wordpress.sql文件导入到wordpress数据库中
```

至此，数据库迁移成功。

可能会遇到的问题：

**mysql导入数据库报错：Unknown collation: utf8mb4\_unicode\_520\_ci**

这是由于两个数据库版本不匹配，记得好像是之前的版本高，现在的版本低。

解决方式：升级mysql，我是升到了5.7解决的。

#### 迁移网站根目录

*   迁移完成网站文件并进行访问时，可能浏览器会出现连不上mysql的错误（仅限wordpress网站）。

**这时你需要修改网站目录下的wp-config.php文件，可能是你迁移完数据库，用户密码错误了。**

*   迁移完成后访问时，浏览器报错502 bad gatway
    
    **此时绝大部分可能是你服务器配置错误，可以排查下apache或者nginx的配置文件**
    
    **fastcgi\_pass 参数，要和你的php版本对应，这个错误必定报502错误。**
    

以上就是我这次遇到的“坑”，希望可以给后来者提供排查的思路。

推荐个一键安装lnmp的脚本----[https://lnmp.org/notice/lnmp-v1-9.html](https://lnmp.org/notice/lnmp-v1-9.html)

如果你不想用服务器自带的一键安装wordpress，用这个脚本可以大大减少你的工作量。