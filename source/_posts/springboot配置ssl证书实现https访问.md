---
title: springboot配置ssl证书实现https访问
date: 2023-05-26 17:52:01
tags:
  - 原创
  - java
categories:
  - 技术分享
id: 20230526a
cover: https://cdn.xiaoliu.life/tc/20230526a/cover.webp
---

不想使用nginx反代，又想要接口能够通过https域名访问怎么办。推荐你直接给后端springboot配置上证书服务。

默认情况下springboot是内置tomcat，既然nginx可以配置ssl证书，那么tomcat肯定也可以直接配置证书。感觉发现了新大陆，直接通过tomcat肯定比nginx反代到tomcat更快。不过直接通过tomcat还是有缺点的，最直观的一点就是只能部署一个后端接口，因为443端口已经被占用了，而使用反代的话理论上只要有端口没被使用就还能部署。

## 使用

首先需要ssl证书，这里可以通过自己本机颁发或者买个域名腾讯云有免费的ssl证书。

### ssl证书

因为在腾讯云有现成的域名，就直接使用它给颁发的证书了。

![](https://cdn.xiaoliu.life/tc/20230526a/1.webp)

这里springboot使用的是tomcat，所以下载tomcat证书。

里面主要有两个文件，一个是以**jks**结尾的证书，一个是密码。

![](https://cdn.xiaoliu.life/tc/20230526a/2.webp)

## springboot配置

### 导入证书

将证书放到**resources**文件夹下，如果项目有多个**Module**建议放到controller模块的resources文件夹下。

### application.yml配置

```yaml
server:
  port: 443
  ssl:
    key-store: classpath: ##证书名字
    key-store-password: ##keystorePass.txt里面存的密码
    key-alias: ##别名，建议填域名
    key-store-type: JKS ##证书类型
```

## https重定向

目前为止配置已经完成，部署到服务器上后浏览器输入域名就能访问了。

但是为了更好的体验，我们想把http重定向到https。在nginx上可以配置301重定向到https，tomcat上怎么弄呢？

主要有两种方式可以实现。

### 启动类中实现

```java
@Bean
public TomcatServletWebServerFactory servletContainer() {
    TomcatServletWebServerFactory tomcat = new TomcatServletWebServerFactory() {
        @Override
        protected void postProcessContext(Context context) {
            SecurityConstraint constraint = new SecurityConstraint();
            constraint.setUserConstraint("CONFIDENTIAL");
            SecurityCollection collection = new SecurityCollection();
            collection.addPattern("/*");
            constraint.addCollection(collection);
            context.addConstraint(constraint);
        }
    };
    tomcat.addAdditionalTomcatConnectors(httpConnector());
    return tomcat;
}

@Bean
public Connector httpConnector() {
    Connector connector = new Connector("org.apache.coyote.http11.Http11NioProtocol");
    connector.setScheme("http");
    connector.setPort(80);
    connector.setSecure(false);
    connector.setRedirectPort(443);
    return connector;
}
```

### 配置类中实现

```java
@Configuration
public class TomcatConfig {
    @Bean
    TomcatEmbeddedServletContainerFactory tomcatEmbeddedServletContainerFactory() {
        TomcatEmbeddedServletContainerFactory factory = new TomcatEmbeddedServletContainerFactory(){
            @Override
            protected void postProcessContext(Context context) {
                SecurityConstraint constraint = new SecurityConstraint();
                constraint.setUserConstraint("CONFIDENTIAL");
                SecurityCollection collection = new SecurityCollection();
                collection.addPattern("/*");
                constraint.addCollection(collection);
                context.addConstraint(constraint);
            }
        };
        factory.addAdditionalTomcatConnectors(createTomcatConnector());
        return factory;
    }
 
    private Connector createTomcatConnector() {
        Connector connector = new
                Connector("org.apache.coyote.http11.Http11NioProtocol");
        connector.setScheme("http");
        connector.setPort(80);
        connector.setSecure(false);
        connector.setRedirectPort(443);
        return connector;
    }
}
```

以上就是springboot配置ssl证书实现https的具体实现了，欢迎留言讨论。