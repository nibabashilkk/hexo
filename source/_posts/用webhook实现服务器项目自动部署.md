---
title: 用webhook实现服务器项目自动部署
date: 2023-01-01 17:28:18
tags:
  - 原创
  - hexo自动部署
  - 服务器
id: "20230101a"
categories:
  - 技术分享
cover: https://gitee.com/favicon.ico
---

讲一下使用webhook自动推送本地git仓库到服务器，主要用到三个工具（<code>git</code>，<code>gitee</code>，<code>云服务器</code>）。

本次电脑使用的win11系统，服务器使用centos7。

github国内访问速度实在不敢恭维，每次提交都会不可避免的失败好多次，所以这次就布置到<code>gitee</code>上了，~~国内访问还是挺快的~~。原本打算把博客托管到它上面，它的实名认证成功打消了我的念头。

回归正题，先讲一下自动部署的原理。

### 原理

静态网站相较于动态网站最直观的区别就是动态网站你可以随时随地的修改，修改的数据会直接保存到云服务器上。而静态网站则需要你本地写好html文档或者通过工具渲染成html文档，之后自己传到服务器上。

不仅需要自己上传，而且在上传前还要保证在本地时每一个你修改的文档可以一个不少的替换到服务器上~~之前我都是把所有文件都替换一遍~~，实在浪费时间。

所以使用<code>git</code>进行管理能节省我们不少的时间。

原理很简单，用个简单流程图来说明一下吧。

本地仓库修改了文件——》push到gitee仓库——》gitee检测到push操作——》gitee调用webhook向配置的网页发送消息——》服务器收到消息重新拉取更新后的仓库——》实现服务器网站文件更新

### 本地仓库配置

大概只需要三步吧，~~默认读者会从gitee创建仓库~~

> 1. 拉取仓库到本地
> 2. 配置ssh访问
> 3. git命令使用

#### 拉取仓库

本次需要拉取的仓库叫**wordpress**。

```powershell
git clone "你的仓库https地址"
```

#### 配置ssh访问

进入仓库配置git以及生成ssh密钥

```powershell
git config --global user.name "your-username"
git config --global user.email "your-email-address"
ssh-keygen -t rsa -C "你的邮箱" ##生成ssh密钥
```

![屏幕截图-2023-01-01-162410](https://cdn.xiaoliu.life/tc/20230101a/屏幕截图-2023-01-01-162410.jpg)

全部默认即可，一路回车。生成的文件放到了**c盘的路径下**~~当然是我的放在c盘~~。

![屏幕截图-2023-01-01-162640](https://cdn.xiaoliu.life/tc/20230101a/屏幕截图-2023-01-01-162640.jpg)

打开这个文件，把里面的公钥复制出来，接下来用它配置gitee公钥。

进入gitee个人中心，选择<code>SSH公钥</code>进行配置。

![屏幕截图-2023-01-01-162851](https://cdn.xiaoliu.life/tc/20230101a/屏幕截图-2023-01-01-162851.jpg)

把之前生成的<code>id_rsa.pub</code>文件里的内容复制到公钥里，名字随便取个即可。

#### git命令使用

git提交三连：

```powershell
git add .
git commit -m "此处填这次更改的信息"
git push
```

可以把本地仓库里文件删掉，测试下能否提交本地更改到gitee。

### 服务器仓库配置

服务器没有安装git的话请先安装git

```shell
yum install git
```

#### 配置ssh访问

和之前配置ssh访问方式一样，三步走。

```shell
git config --global user.name "your-username"
git config --global user.email "your-email-address"
ssh-keygen -t rsa -C "你的邮箱" ##生成ssh密钥
```

服务器同样使用<code>.pub</code>后缀文件里的公钥。

不过gitee本次配置的是仓库的部署公钥。

**因为我的仓库配置的是私有的，如果仓库配置成公有的则跳过这一小章**

![屏幕截图-2023-01-01-164113](https://cdn.xiaoliu.life/tc/20230101a/屏幕截图-2023-01-01-164113.jpg)

找到仓库的“管理”——“添加公钥”，把服务器<code>.pub</code>文件里的内容复制到这里即可。同样，名字可以随便取。

#### 拉取仓库

用ssh方式拉取仓库，如果不需要输**账号和密码**就能拉取仓库成功，说明本次配置已完成。

```shell
git clone "你的ssh方式仓库地址" ##一般情况下以"git@gitee.com:"开头
```

### 配置webhook

在服务器自动部署原理开头已经说过了，<code>webhook</code>在里面占着很大的比重。

#### 服务器配置

服务器需要nodejs环境

```shell
yum install nodejs
yum install npm
```

安装模块<code>git-webhook-handler</code>和<code>pm2</code>

```shell
npm install git-webhook-handler --save
npm i -g pm2
```

新建webhook.js文件

```shell
var http = require('http')
var createHandler = require('git-webhook-handler')
var handler = createHandler({ path: '/webhook', secret: '你自己的密码' })##此密码应与gitee设置的webhook密码一致

function RunCmd(cmd, args, cb) {
      var spawn = require('child_process').spawn;
      var child = spawn(cmd, args);
      var result = '';
      child.stdout.on('data', function(data) {
            result += data.toString();
      });
      child.stdout.on('end', function() {
            cb(result)
      });
}

http.createServer(function (req, res) {
      handler(req, res, function (err) {
        res.statusCode = 404;
        res.end('no such location');
      })
}).listen(4567)###webhook监听端口

handler.on('error', function (err) {
    console.error('Error:', err.message);
})

handler.on('push', function (event) {###监听push事件
    console.log('Received a push event for %s to %s',
    event.payload.repository.name,
    event.payload.ref);
      var shpath = './blog-start.sh'; ###发生push时启动的脚本
      RunCmd('sh', [shpath], function(result) {
          console.log(result);
      })
})
```

此文件含义是启动webhook服务，监听服务器的4567端口，当收到push消息后运行当前目录下的<code>blog-start.sh</code>脚本。

当然，既然要运行<code>blog-start.sh</code>脚本，自然要在同级目录下创建一个。

脚本代码如下：

```shell
#!/bin/bash

WEB_PATH='你的网站目录'

echo "Start deployment"
cd $WEB_PATH
echo "pulling source code..."
git reset --hard origin/main
git clean -f
git pull
git checkout main
echo "changing permissions..."
echo "Finished."
```

此脚本做的事情是进入你的网站目录，拉取gitee仓库里的文件到本地。

至此，服务器端配置就完成了。

#### gitee配置

找到gitee仓库的”WebHook管理“，添加一个新的WebHook。

![屏幕截图-2023-01-01-170618](https://cdn.xiaoliu.life/tc/20230101a/屏幕截图-2023-01-01-170618.jpg)

对WebHook进行配置

![屏幕截图-2023-01-01-170657](https://cdn.xiaoliu.life/tc/20230101a/屏幕截图-2023-01-01-170657.jpg)

**url**填你的服务器地址和端口，例http://127.0.0.1:4567/webhook ，~~当然ip肯定是不对的~~

**WebHook密码**这个随便填，注意要和服务器<code>webhook.js</code>里面设置的密码一样

**选择事件**就选个Push就可以了

添加完成后测试显示返回码200才算部署成功。

![屏幕截图-2023-01-01-171227](https://cdn.xiaoliu.life/tc/20230101a/屏幕截图-2023-01-01-171227.jpg)

如果有错误的话可能是服务器端口没开放~~尤其是阿里云和腾讯云注意开端口~~。

实在解决不了可以留言，我尽量看看吧。

如果觉得开端口不安全的话也可以用nginx进行反代理，我是懒得弄的，就不在这写了。

### 推送代码

至此全部教程就已经结束了，赶快尝试推送一下吧。

hexo本身自带hexo d推送到gitee，也可以用这个~~我反正习惯用git~~。