---
title: java实现发送邮件
date: 2023-05-16 22:29:30
tags:
  - 原创
  - java
categories:
  - 技术分享
id: 20230516a
cover: https://cdn.xiaoliu.life/tc/20230516a/cover.webp
---

本文介绍下java实现邮件的发送，意在网站用户评论时能够及时通知站长和用户评论被回复后能够及时通知用户。

下文介绍下具体实现。

### java实现

首先引入springboot的邮箱依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-mail</artifactId>
</dependency>
```

配置邮箱参数，这里以**qq邮箱**作为示例

```yml
spring:
    mail:
        host: smtp.qq.com #qq邮箱
        username:             #用户名，填qq邮箱地址。例如xxx@qq.com
        password:             #qq邮箱授权码，网上搜索怎么获得
```

此时就差不多了，接下来实现邮箱工具类

```java
@Component
public class MailUtil {
    @Value("${spring.mail.username}")
    private String from; //这是发送人
    @Autowired
    JavaMailSender javaMailSender;
    public ResponseDto sendMail(String to,String subject,String content){
        SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
        simpleMailMessage.setFrom(from);
        simpleMailMessage.setTo(to);
        simpleMailMessage.setSubject(subject);
        simpleMailMessage.setText(content);
        javaMailSender.send(simpleMailMessage);
        return ResponseDto.Ok();
    }
}
```

此时调用**MailUtil**里的**sendMail**方法就能实现发送邮件了。

实践中发现每次都需要等待邮件发送成功后接口才会返回，不符合我们的实际需求。故需在发送邮件时开辟一个新线程，即可满足我们的需求。

为了减少大规模请求下创建线程的开销，引入线程池来处理发送邮件事件。

### 线程池

使用**@Configuration**注解保证初始化线程池只有一次，使用**@Bean**注解在程序启动时就注入到**IOC容器**内，这样可以保证程序启动后就会初始化线程池。

```java
@Configuration
@Slf4j
public class ThreadPool {
    private Integer maxPoolSize = Runtime.getRuntime().availableProcessors()*5;
    private Integer corePoolSize = 5;

    @Bean
    public ExecutorService buildThreadPool() {
        log.info("开始创建线程池");
        ExecutorService pool = new ThreadPoolExecutor(corePoolSize, maxPoolSize, 60L, TimeUnit.SECONDS, new ArrayBlockingQueue<Runnable>(100));
        return pool;
    }
}
```

**ThreadPoolExecutor**感兴趣的可以自己看，在此不过多介绍。

现在就可以使用线程来发送邮件了。

```java
threadPool.buildThreadPool().submit(new Runnable() {
    @Override
    public void run() {
        String to,subject = null;
        if(comment.getParentId() == -1){
        	to = mail;
        	subject = "有人在你的博客评论了";
        } else{
       		to = commentService.getById(comment.getParentId()).getUserEmail();
        	subject = "有人回复了你的评论";
        }
        mailUtil.sendMail(to,subject,"有人回复了你的评论,点击链接跳转到评论回复页面,https://xiaoliu.life/p/"+comment.getBlogId());
    }
});
```

最后实现效果：

![](https://cdn.xiaoliu.life/tc/20230516a/1.webp)

