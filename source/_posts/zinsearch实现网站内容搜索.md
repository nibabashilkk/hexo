---
title: zinsearch实现网站内容搜索
date: 2023-05-18 15:40:41
tags:
  - 原创
  - java
categories:
  - 技术分享
id: 20230518a
cover: https://cdn.xiaoliu.life/tc/20230518a/cover.webp
---

作为**elasticsearch**的平替——**zincsearch**，其最大的优点就是轻量。由Go语言实现的它天生就有着占用资源少，启动快等优势。对于一些小站来说，如果不想使用数据库的模糊查询作为网站的搜索方式，那么zincsearch未尝不是一种更好的选择。

接下来介绍下zinsearch的安装与使用。

### 安装

官网：[安装 - 《ZincSearch 中文文档 - 帮助手册 - 教程》 - 极客文档 (geekdaxue.co)](http://geekdaxue.co/read/ZincSearch-doc/install?wd=zincsearch)

zincsearch官网有安装教程，推荐使用**Docker**进行安装，可以省下许多配置环境的时间。

官网没有使用docker-compose的安装教程，在此发下我的docker-compose.yml文件。

```yaml
version: '3.5'

services:
  zinc: ## mqtt 服务
    image: public.ecr.aws/zinclabs/zinc:latest
    environment:
      - ZINC_FIRST_ADMIN_USER=admin
      - ZINC_FIRST_ADMIN_PASSWORD=admin
    ports:
      - "4080:4080"
    volumes:
      - ./data:/data
    restart: always
```

默认拉取最新的zinc镜像，默认账号密码都是admin。

### 使用

zincsearch兼容elasticsearch部分api，如果你之前使用过它那么你将会很快上手zincsearch。

首先需要创建个index。index相当于mysql的数据库。建议调用api创建index，直接写死在代码里，要不然每次还得手动创建。

因为刚开始使用，了解也不太多，就简单介绍下网站使用到的**插入**和**查找**功能。

#### 插入

zinsearch自带swagger页面，可以去查找相关功能的实现接口。

例如插入功能就可以使用**/api/{index}/_doc/{id}**这个接口。指定id可以在更新document时知道操作的是哪一个，那么想插入一个id等于1的document就可以如下操作。

下面给个使用java封装调用插入document的示例。

```java
public void insertData(ZincInsertDto zincInsertDto){
    String uri = zincProperties.getIp()+"/api/"+zincProperties.getIndex()+"/_doc/"+zincInsertDto.getId();
    String auth = "Basic "+ Base64Util.base64Encode(zincProperties.getUsername()+":"+zincProperties.getPassword());
    HttpHeaders httpHeaders = new HttpHeaders();
    httpHeaders.add("Authorization",auth);
    Map<String,String> map = new HashMap<>();
    map.put("title",zincInsertDto.getTitle());
    map.put("content",zincInsertDto.getContent());
    HttpEntity<Object> httpEntity = new HttpEntity<Object>(map,httpHeaders);
    restTemplate.put(uri,httpEntity);
}
```

上面示例中index有两个额外的属性**title**和**content**，都是通过dto传过来的。同时请求的时候需要加上身份验证，即**httpHeaders**内容。

#### 查询

zinsearch查询功能建议使用**/es/{index}/_search**接口。

因为查询时可以配置条件过多，这里就不一一介绍了，简单介绍下几个常用的参数。

```json
{
    "from": 0,
    "size": 20,
    "query":{
        "multi_match":{
            "query":"测试",
            "fields":["title","content"]
        }
    },
    "highlight": {
        "fields": {
            "title":{},
            "content":{}
        }
    }
}
```

**from**：从哪条开始查询。

**size**：最多返回多少个查询结果。

**query**：查询条件，其中**multi_match**表示可以从多个属性里查询；示例中的index里有title和content两个属性值，即这个查询条件是查询标题和内容里所有含有**测试**的document。

**highlight**：表示返回的document，其中匹配到的词语会被高亮。

下图是一个java封装的查询请求示例。

```java
public ResponseDto getSearchResult(@RequestBody String condition){
    String query = "{\n" +
    "    \"from\": 0,\n" +
    "    \"size\": 20,\n" +
    "    \"query\":{\n" +
    "        \"multi_match\":{\n" +
    "            \"query\":\""+condition+"\",\n" +
    "            \"fields\":[\"title\",\"content\"]\n" +
    "        }\n" +
    "    },\n" +
    "    \"highlight\": {\n" +
    "        \"fields\": {\n" +
    "            \"title\":{},\n" +
    "            \"content\":{}\n" +
    "        }\n" +
    "    }\n" +
    "}";
    Map map = JSON.parseObject(query,new TypeReference<Map>(){});
    return ResponseDto.Ok(zincUtil.getSearchResult(map));
}
public Object getSearchResult(Map query){
    String uri = zincProperties.getIp()+"/es/"+zincProperties.getIndex()+"/_search";
    String auth = "Basic "+ Base64Util.base64Encode(zincProperties.getUsername()+":"+zincProperties.getPassword());
    HttpHeaders httpHeaders = new HttpHeaders();
    httpHeaders.add("Authorization",auth);
    HttpEntity<Object> httpEntity = new HttpEntity<Object>(query,httpHeaders);
    Object responseDto = restTemplate.postForObject(uri,httpEntity, Object.class);
    return responseDto;
}
```

同样，调接口时需要身份认证，封装好传给**httpEntity**即可。