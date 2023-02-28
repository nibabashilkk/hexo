---
title: github免费图床教程
tags:
  - 原创
  - 图床教程
id: '20221109a'
categories:
  - - 技术分享
date: 2022-11-09 21:45:06
---

最近把网站基本所有的静态文件（例如css,js,图片）都放到了github（无限空间且能通过链接进行访问图片，妥妥的图床好吧）上免费保存了。

但是由于国内访问github经常会超时，所以就需要免费的cdn加速访问。

之前尝试用jsDelivr加速github，但是前一段时间好像备案问题，用jsDelivr访问图片打不开了，但css,js文件还是能访问到的。

今日介绍几个除了jsDelivr，其他国外免费加速github的方法。

你问为什么没有国内的？

我只能呵呵。

#### jsDelivr

首先还是介绍下jsDelivr，毕竟除了图片，其他还是能用的。

> 1.  新建一个github仓库用来存你需要加载的图片
> 2.  上传图片（可以用git进行管理，也可以直接在浏览器页面上传）
> 3.  用jsDelivr加速访问

新建github仓库和上传图片就不说了，不会的自己摸索。。。

##### jsDelivr加速

正常github访问一个图片链接应该是

```url
https://raw.githubusercontent.com/nibabashilkk/tc1/main/1665552126-1-1024x552.png
```

正常情况没有“翻墙”情况下应该访问失败

用jsDelivr加速

```url
https://cdn.jsdelivr.net/gh/nibabashilkk/tc1@latest/1665552126-1-1024x552.png
```

大概就是这样，把raw.githubusercontent.com换成cdn.jsdelivr.net/gh，gh代表github。

nibabashilkk是我的用户名；tc1是我仓库的名字；@latest代表最新的版本，基本全都用这个就行了；最后的1665552126-1-1024x552.png是需要显示的图片名称。

当然jsDelivr也能加速其他的，其他的和加速github用法差不多，就不多说了。

#### statically

在jsDelivr不能用后，statically是我之后找的平替。

它和jsDeliver同样可以加速github文件，但是由于服务器基本都在国外，只能说贼慢。

不知道有没有注意到我博客首页的8K大图，它就是我放到github上用statically加速访问的结果。

每次加载的时候都在那里转老半天。

##### **用法**

statically用法和jsDelivr差不多。

和上面一样，正常访问github里面的图片应该是这样

```url
https://raw.githubusercontent.com/nibabashilkk/tc1/main/1665552126-1-1024x552.png
```

用statically加速访问

```url
https://cdn.staticaly.com/gh/nibabashilkk/tc1/main/1665552126-1-1024x552.png
```

把raw.githubusercontent.com换成cdn.staticaly.com/gh，gh代表github。

nibabashilkk是我的用户名；tc1是我仓库的名字；main代表主分支（如果你没有其他分支，无脑填main就可以了），基本全都用这个就行了；最后的1665552126-1-1024x552.png是需要显示的图片名称。

#### cloudflare

和之前发过的一篇建立zlibrary镜像文章一样，只不过这次我们建立的是github镜像，具体操作方法可以看我之前建立zlibrary文章，跳转到制作zlibrary镜像文章请点这。

其他步骤都一样，只不过需要把之前指向zlibrary的代码换成下面的。

![屏幕截图 2022-11-09 211233.png (738×866) (staticaly.com)](https://cdn.xiaoliu.life/tc/20221109a/屏幕截图-2022-11-09-211233.png)

```javascript
// 你要镜像的网站.
const upstream = 'www.github.com'
​
// 镜像网站的目录，比如你想镜像某个网站的二级目录则填写二级目录的目录名，镜像 google 用不到，默认即可.
const upstream_path = '/'
​
// 镜像站是否有手机访问专用网址，没有则填一样的.
const upstream_mobile = 'www.github.com'
​
// 屏蔽国家和地区.
const blocked_region = ['KP', 'SY', 'PK', 'CU']
​
// 屏蔽 IP 地址.
const blocked_ip_address = ['0.0.0.0', '127.0.0.1']
​
// 镜像站是否开启 HTTPS.
const https = true
​
// 文本替换.
const replace_dict = {
    '$upstream': '$custom_domain',
    '//github.com': ''
}
​
// 以下保持默认，不要动
addEventListener('fetch', event => {
    event.respondWith(fetchAndApply(event.request));
})
​
async function fetchAndApply(request) {
​
    const region = request.headers.get('cf-ipcountry').toUpperCase();
    const ip_address = request.headers.get('cf-connecting-ip');
    const user_agent = request.headers.get('user-agent');
​
    let response = null;
    let url = new URL(request.url);
    let url_hostname = url.hostname;
​
    if (https == true) {
        url.protocol = 'https:';
    } else {
        url.protocol = 'http:';
    }

    if (await device_status(user_agent)) {
        var upstream_domain = upstream;
    } else {
        var upstream_domain = upstream_mobile;
    }

    url.host = upstream_domain;
    if (url.pathname == '/') {
        url.pathname = upstream_path;
    } else {
        url.pathname = upstream_path + url.pathname;
    }

    if (blocked_region.includes(region)) {
        response = new Response('Access denied: WorkersProxy is not available in your region yet.', {
            status: 403
        });
    } else if (blocked_ip_address.includes(ip_address)) {
        response = new Response('Access denied: Your IP address is blocked by WorkersProxy.', {
            status: 403
        });
    } else {
        let method = request.method;
        let request_headers = request.headers;
        let new_request_headers = new Headers(request_headers);

        new_request_headers.set('Host', url.hostname);
        new_request_headers.set('Referer', url.hostname);

        let original_response = await fetch(url.href, {
            method: method,
            headers: new_request_headers
        })

        let original_response_clone = original_response.clone();
        let original_text = null;
        let response_headers = original_response.headers;
        let new_response_headers = new Headers(response_headers);
        let status = original_response.status;

        new_response_headers.set('access-control-allow-origin', '*');
        new_response_headers.set('access-control-allow-credentials', true);
        new_response_headers.delete('content-security-policy');
        new_response_headers.delete('content-security-policy-report-only');
        new_response_headers.delete('clear-site-data');

        const content_type = new_response_headers.get('content-type');
        if (content_type.includes('text/html') && content_type.includes('UTF-8')) {
            original_text = await replace_response_text(original_response_clone, upstream_domain, url_hostname);
        } else {
            original_text = original_response_clone.body
        }

        response = new Response(original_text, {
            status,
            headers: new_response_headers
        })
    }
    return response;
}

async function replace_response_text(response, upstream_domain, host_name) {
    let text = await response.text()

    var i, j;
    for (i in replace_dict) {
        j = replace_dict[i]
        if (i == '$upstream') {
            i = upstream_domain
        } else if (i == '$custom_domain') {
            i = host_name
        }
        if (j == '$upstream') {
            j = upstream_domain
        } else if (j == '$custom_domain') {
            j = host_name
        }

        let re = new RegExp(i, 'g')
        text = text.replace(re, j);
    }
    return text;
}
async function device_status(user_agent_info) {
    var agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
    var flag = true;
    for (var v = 0; v < agents.length; v++) {
        if (user_agent_info.indexOf(agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}
```

