---
title: wordpress网页美化
tags: []
id: '20221215a'
categories:
  - - 技术分享
comments: false
date: 2022-12-15 21:53:47
---

分享下个人网站美化方法，建议不要过度美化，会严重拖慢网页打开速度，影响体验。

#### 看板娘

网站美化最常见的就是左下角的看板娘了，既好看又有趣。

![屏幕截图 2022-12-15 204715](https://cdn.xiaoliu.life/tc/20221215a/屏幕截图-2022-12-15-204715.jpg)

Hide键会隐藏看板娘；Switch键会切换看板娘形象，总有一款你会喜欢；Save键会保存当前看板娘形象。鼠标放到看板娘身上或者点击都会触发对话效果。

实现方式也比较简单，都是别的大佬封装好的，拿来用即可。

百度网盘链接：[https://pan.baidu.com/s/1JnuEgLktCucza6kM4vOJ9A?pwd=lyug](https://pan.baidu.com/s/1JnuEgLktCucza6kM4vOJ9A?pwd=lyug)

压缩包里有两个文件夹，解压后放到同级目录下即可（我是放到了网站根目录）。

```html
<script src="/live2d_girls/autoload.js"></script>
```

在主题的footer.php文件的footer标签里加上面一句即可。

刷新页面，看看你的页面出没出现可爱的看板娘。

#### 页面樱花

![屏幕截图 2022-12-15 210026](https://cdn.xiaoliu.life/tc/20221215a/屏幕截图-2022-12-15-210026.jpg)

整个页面会一直有樱花飘落，这个是真的好看，不过感觉有点影响阅读，后来就取消掉了。

```html
<script src="https://cdn.staticaly.com/gh/nibabashilkk/wordpress/master/web.js"></script>
```

把上面一段代码加到foot标签或者head标签里即可。

如果感觉加载缓慢，建议把web.js文件下载到自己网站服务器上，本地加载。

海外服务器加载github文件不可避免的会慢。

#### 菜单栏小图标

![image-20221215211834291](https://cdn.xiaoliu.life/tc/20221215a/屏幕截图-2022-12-15-211753.jpg)

默认菜单栏前是没有小图标的，这些图标可以自己通过标签代码加上去。

![屏幕截图 2022-12-15 211950](https://cdn.xiaoliu.life/tc/20221215a/屏幕截图-2022-12-15-211950.jpg)

在图标库网站找到喜欢的图标，把图标代码复制到导航标签里即可。

图标库网址：[https://fontawesome.com.cn/faicons/](https://fontawesome.com.cn/faicons/)

我目前正在用的图标代码：

```html
<i class="fa fa-home" aria-hidden="true"></i> 首页图标
<i class="fa fa-cogs" aria-hidden="true"></i> 分类图标
<i class="fa fa-link" aria-hidden="true"></i> 友链图标
<i class="fa fa-archive" aria-hidden="true"></i> 归档图标
<i class="fa fa-tags" aria-hidden="true"></i> 图片图标
<i class="fa fa-database" aria-hidden="true"></i> 仓库图标
```

#### 侧边线条体

![image-20221215214029632](https://cdn.xiaoliu.life/tc/20221215a/屏幕截图-2022-12-15-213949.jpg)

目前我的页面正在使用的就是这个，得益于大佬的开源，可以直接引用大佬的项目。

```html
<script color="0,0,255" opacity='1' zIndex="-1" count="100" src="https://cdn.bootcss.com/canvas-nest.js/2.0.4/canvas-nest.js" type="text/javascript"></script>
```

可以指定几个属性

color指定线条的颜色，建议弄成黑色，比较显眼，之前弄的红色都看不出来有线条。

opacity线条透明度，默认是0.5

zIndex我也不知到干什么的，默认-1

count线条的数量，默认150

除此之外，还有很多界面美化的插件，如果动手能力实在不行的话可以考虑，否则装太多的插件只会拖慢网页加载速度。