---
title: springboot整合redis
date: 2023-03-03 18:35:34
tags:
  - 原创
  - java
catagories:
  - 技术分享
id: 20230303a
cover: https://cdn.xiaoliu.life/tc/20230303a/cover.webp
---

不少大型网站都会做数据缓存，当收到前端发来的请求后，首先去缓存里查数据，如果缓存里找不到的话再去数据库中查询，最后把查询到的数据放入到缓存中。

常见的缓存中间件有**redis**、**Memcache**等等，今天就讲一下**springboot**整合redis的步骤。

### 安装redis

本人采用docker容器化部署~~实在是太快了~~，只需要写一个简单的**docker-compose.yml**文件就能拉取下最新的镜像并且运行成功，当然更简单的话连docker-compose都不需要用，直接命令行用docker部署。不过还是建议用docker-compose部署，部署容器多了的话比较容易管理。

#### docker-compose.yml配置

```yml
version: '3' #设置docker compose 版本
services: #设置services
  redis:
    image: redis:latest  #镜像名称
    container_name: redis #容器名称
    restart: always  #重启docker引擎后该容器也重启
    ports:
      - 6379:6379 #本地端口号与容器内部端口号
    volumes: #指定挂载目录
      - ./data/redis/redis.conf:/usr/local/etc/redis/redis.conf:rw
      - ./data/redis/data:/data:rw
    command:
      /bin/bash -c "redis-server /usr/local/etc/redis/redis.conf "
    networks: #可用可不用
      blog_network:
networks:
      blog_network:
```

```shell
docker-compose up -d #使用此命令即可启动了
```

redis有16个数据库，默认在0号数据库上操作。redis支持身份认证，默认是没有密码的，可以通过以下命令设置密码。

```shell
config set requirepass 123456 #“123456” 此处填你的密码
```

redis支持五种数据类型，分别是**String**、**Hash**、**List**、**Set**、**Zset**。默认的数据类型是**String**，个人用的最多的也是这个，当你犹豫不决用什么数据类型时，试试String吧。

### SpringBoot整合redis

没什么好说的，都是傻瓜式操作。

#### maven引入依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```

#### 代码操作

spring已经给我们封装好了各种对redis的操作，我们只需要使用**RedisTemplate**对象即可。

可以直接在**service**层注入**RedisTemplate**对redis进行操作，个人比较习惯封装成工具类，提高代码美化和可读性。

```java
public class RedisUtil {
    @Autowired
    private RedisTemplate<String,String> redisTemplate;

    public String get(String key){
        return redisTemplate.opsForValue().get(key);
    }

    public void set(String key,String value){
        redisTemplate.opsForValue().set(key,value,1, TimeUnit.DAYS);#可以设置过期时间
    }

    public boolean exist(String key){
        return redisTemplate.hasKey(key);
    }
}
```

以下是redis源码中关于配置文件的默认配置

```java
 private int database = 0;
    private String url;
    private String host = "localhost";
    private String password;
    private int port = 6379;
    private boolean ssl;
    private Duration timeout;
    private String clientName;
    private RedisProperties.Sentinel sentinel;
    private RedisProperties.Cluster cluster;
    private final RedisProperties.Jedis jedis = new RedisProperties.Jedis();
    private final RedisProperties.Lettuce lettuce = new RedisProperties.Lettuce();
```

可以看到默认redis的ip是本地，如果你是在本地调试的话，需要重新配置**host**参数。

默认端口是**6379**，如果你改变的话也是需要在springboot的配置文件下配置的。

总的来说springboot整合redis不难，它把方法都给你封装好了，只需要调用即可。