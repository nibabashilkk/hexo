---
title: zlibrary镜像教程(详细教程)
tags:
  - zlibrary
  - 原创
id: '20221012a'
categories:
  - - 技术分享
date: 2022-10-12 13:32:57
---

今天分享一下制作属于自己的zlibrary镜像教程。  
**准备条件**：  
注册好cloudflare(用来做跳转，网址 https://dash.cloudflare.com/)一个域名（我买的腾讯的，下文说域名的作用）有了这两个条件，就可以制作镜像了，是不是很简单。注册完成后进入界面，首先创建一个服务。

![](https://cdn.xiaoliu.life/tc/20221012a/1665552126-1.png)

可以自己起个服务的名字，也可以用他生成的，点击下一步。

![](https://cdn.xiaoliu.life/tc/20221012a/1665552165-2.png)

什么都不用改，直接进行编辑。

![](https://cdn.xiaoliu.life/tc/20221012a/1665552190-3.png)

清除最左边框里面的代码，把下面代码复制进去，保存即可。

![](https://cdn.xiaoliu.life/tc/20221012a/1665552290-4.png)

代码如下：

```javascript
// 你要镜像的网站.
const upstream = 'zh.zlibrary.org'


// 镜像网站的目录，比如你想镜像某个网站的二级目录则填写二级目录的目录名，镜像 google 用不到，默认即可.
const upstream_path = '/'


// 镜像站是否有手机访问专用网址，没有则填一样的.
const upstream_mobile = 'zh.1lib.education'


// 屏蔽国家和地区.
const blocked_region = ['KP', 'SY', 'PK', 'CU']


// 屏蔽 IP 地址.
const blocked_ip_address = ['0.0.0.0', '127.0.0.1']


// 镜像站是否开启 HTTPS.
const https = true


// 文本替换.
const replace_dict = {
    '$upstream': '$custom_domain',
}


// 以下保持默认，不要动
addEventListener('fetch', event => {
    event.respondWith(fetchAndApply(event.request));
})


async function fetchAndApply(request) {


    const region = request.headers.get('cf-ipcountry').toUpperCase();
    const ip_address = request.headers.get('cf-connecting-ip');
    const user_agent = request.headers.get('user-agent');


    let response = null;
    let url = new URL(request.url);
    let url_hostname = url.hostname;


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

至此，正常情况下点击前面生成的网站链接应该就可以访问了。

![](https://cdn.xiaoliu.life/tc/20221012a/1665552396-5.png)

但由于cloudflare用的太多了，目前已经被屏蔽了。所以这时候我们的域名就起作用了，做一个跳转。  
由于我是在腾讯买的域名，接下来就以腾讯的域名进行讲解。首先你得先去腾讯买一个域名，差不多十块一年。  
之后回到首页，创建一个网站。

![](https://cdn.xiaoliu.life/tc/20221012a/1665552428-6.png)

把你买的域名输进去，点击下一步。

有几种套餐会让你选，当然要白嫖了，选免费的。

![](https://cdn.xiaoliu.life/tc/20221012a/1665552470-7.png)

最后需要你改一下你域名的dns解析，用cloudflare的域名解析。

![](https://cdn.xiaoliu.life/tc/20221012a/1665552515-8.png)

把上面那俩复制下来，到你腾讯后台“我的域名”，把原来的dns解析换成这个。

![](https://cdn.xiaoliu.life/tc/20221012a/1665552547-9.png)

验证完成后，去workers把你的域名加进去就可以了。

![](https://cdn.xiaoliu.life/tc/20221012a/1665552666-%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE-2022-10-12-132956.png)

至此，你用你的域名访问应该就可以访问到了。

公众号中发的教程网了把最后一步发上去了，又由于公众号文章发布后只能改20个字，只能再博客再发一遍了。不好意思大家。