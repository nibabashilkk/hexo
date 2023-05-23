---
title: 注解方式实现放行SpringSecurity匿名端口和遇到的坑
date: 2023-04-26 20:00:19
tags:
  - 原创
  - java
id: 20230426a
categories:
  - 技术分享
cover: https://cdn.xiaoliu.life/tc/20230426a/cover.webp
---

利用下班时间搞了几天，总算把**Spring Security**搞的差不多了（虽然原来还不是很熟，但能跑了）。

整合到**SpringBoot**倒是挺简单的，就是对一些接口放行的时候总是有问题。网上的教程大多是**5.7.0**版本之前的，而我为了尝鲜，技术基本都是用的最新的。这就导致走了很多坑 Σ( ￣д￣；) ！！！

因为博客就我一个人使用，就一个用户就够了，也不需要什么权限控制，就一切随简了。

### 整合Spring Security

#### 导入依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

一键引入即可

#### 登录

引入后此时再访问接口就会提示需要登录了，默认账户的**user**，密码在启动时随机生成。

![](https://cdn.xiaoliu.life/tc/20230426a/1.webp)

随机密码每次启动程序会更新，所以可以弄一个固定的用户，这里就有两种方案——**配置文件**和**数据库**。

对我来说一个用户就够了，所以只需要在配置文件设置默认账户密码即可。

```yaml
spring:
  security:
    user:
      name: 123
      password: 123
```

需要多用户的话可以在数据库创建**user**表，这里就不多说了。

#### 对一些接口放行

现在基本已经大功告成了，访问接口时会让你输入账号和密码。但是我们想要的是只有当对数据库进行**增**、**删**和**改**的时候再进行登录认证，用户查询的时候就不需要登录。

想象一下，当某人访问你的网站时候，需要先登录才可以看到网站内容，而且账号密码只有你自己知道。

那我觉得这件事真是**泰裤辣！！！**ε=ε=ε=ε=ε=ε=┌(;￣◇￣)┘

言归正传，为了实现上面的需求我们需要对某些接口放行。

同样有两种方式可以实现上面需求，两者最大的区别就是走不走**Spring Security过滤链**。这里我建议登录的话走Spring Security过滤链吧，虽然我在这里遇到个贼大的坑( ᖛ ̫ ᖛ )ʃ)。

简单介绍下两种方式，学的不精，多多指教。5.7.0版本后的Spring Security已经弃用了**WebSecurityConfigurerAdapter**，这里就只介绍新版的使用。

##### HttpSecurity

这就是走Spring Security过滤链的方式，下面是一个简单例子。

```java
@Configuration
public class SecurityConfiguration {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests((authz) -> authz
                .anyRequest().authenticated()
            )
            .httpBasic(withDefaults());
        return http.build();
    }
}
```

##### WebSecurity

这是不走Spring Security过滤链的方式，下面是一个简单的例子。

```java
@Configuration
public class SecurityConfiguration {
    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        return (web) -> web.ignoring().requestMatchers("/ignore1", "/ignore2");
    }
}
```

##### 我的实现

放行的时候需要知道接口的地址，例如上面的**"/ignore1", "/ignore2"**。当然可以选择每次写新功能的时候再修改这部分，把新接口也放行。我比较懒，再接口上加上自定义注解，然后扫描所有带有自定义注解的方法，获取接口的地址，再依次放行。

首先实现自定义注解。

```java
@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface IgnoreAuth {
}
```

然后扫描所有的方法，找到带有自定义注解的接口，对它放行。

```java
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
    Map<RequestMappingInfo, HandlerMethod> handlerMethodMap = requestMappingHandlerMapping.getHandlerMethods();
    handlerMethodMap.forEach((info,method)-> {
        if (method.getMethodAnnotation(IgnoreAuth.class) != null) {
            info.getPathPatternsCondition().getPatterns().forEach(pattern -> {
                try {
                    httpSecurity.authorizeHttpRequests(auth -> {
                        auth.requestMatchers(pattern.getPatternString()).permitAll();
                    }).httpBasic(Customizer.withDefaults());
                } catch (Exception e) {
                    log.error("开放匿名端口失败");
                }
            });
        }
    });
    httpSecurity.authorizeHttpRequests(auth->{
        try {
            auth.and().csrf().disable();
        } catch (Exception e) {
            log.error("禁用csrf验证失败");
        }
    });
    return httpSecurity.build();
}
```

别忘了在你想要放行的接口上加上自定义注解，就像下面这样。

```java
@IgnoreAuth //自定义注解
@GetMapping("/get")
public List<Ssr> get(){
    return ssrService.list();
}
```

OK，现在就已经完全实现了，至于之后的**jwt生成token**发给前端，前端携带token访问需要登录的接口，这个功能还没做，敬请期待下次讲解。

### 遇到的坑

其实功能没多少，基本一晚就写完了，但是实在没想到有坑啊！！！

```java
httpSecurity.authorizeHttpRequests(auth->{
    try {
        auth.and().csrf().disable();
    } catch (Exception e) {
        log.error("禁用csrf验证失败");
    }
});
```

上面代码中肯定有人好奇为什么需要这一步，这个就是本次最大的坑。

了解**csrf攻击**的话就知道这个功能是干什么的了，为什么要把它禁用掉呢？

最大的原因是我用不到，因为之后要用token认证，而token正好能防御住csrf攻击。其次是把csrf这个功能打开的话，没有**csrfToken**的话会把你的**post**和**delete**拦截。这就导致了即使你上面开放了端口，但有些**post**方式的查询端口还是访问不了。

最简单粗暴的解决方式就是上面那样，把它禁用掉。

这个问题困扰了我很长时间，总是以为自己没有把那个端口放开〜(￣△￣〜)。

