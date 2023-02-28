---
title: mybaties-plus实现增删查改及分页操作
date: 2023-01-26 16:23:32
tags:
  - 原创
  - java
categories:
  - 技术分享
id: 20230126a
cover: https://cdn.xiaoliu.life/tc/20230126a/cover.png
---

简单介绍下<code>mybaties-plus</code>实现对数据库进行**增删查改**操作。

主要功能是实现分页查询每个人各科成绩。

### 实体类

#### student表

学生主要有三个属性，学生id、学生名字和性别。

代码实现：

```java
@Data
@TableName("student")
@Builder
public class Student {
    @Id
    @TableField(value = "id")
    private Integer id;
    @TableField(value = "name")
    private String name;
    @TableField(value = "sex")
    private String sex;

    public Student(Integer id, String name, String sex) {
        this.id = id;
        this.name = name;
        this.sex = sex;
    }

    public Student() {
    }
}
```

#### 课程表

学校里考试的课程，属性有课程id和课程名称。

代码实现：

```java
@Data
@Builder
@TableName("lesson")
public class Lesson {
    @Id
    @TableField(value = "id")
    private Integer id;
    @TableField(value = "name")
    private String name;

    public Lesson() {
    }

    public Lesson(Integer id, String name) {
        this.id = id;
        this.name = name;
    }
}
```

#### 成绩表

里面存有所有学生的每一科成绩，只存有学生id和课程id~~用来增加工作量~~。

代码实现：

```java
@Data
@TableName("score")
@Builder
public class Score {
    @Id
    @TableField(value = "score_id")
    private Integer scoreId;
    @TableField(value = "student_id")
    private Integer studentId;
    @TableField(value = "lesson_id")
    private Integer lessonId;
    @TableField(value = "score")
    private Integer score;

    public Score(Integer scoreId, Integer studentId, Integer lessonId, Integer score) {
        this.scoreId = scoreId;
        this.studentId = studentId;
        this.lessonId = lessonId;
        this.score = score;
    }

    public Score() {
    }
}
```

#### 学生各科成绩表

通过联合查询找到每个学生各科成绩，以<code>EveryScoreDto</code>形式进行展示。

代码实现：

```java
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EveryScoreDto {
    private String studentName;
    private String lessonName;
    private Integer score;
}
```

### 持久层

主要还是继承的mybaties-plus自带的mapper接口里的方法，也尝试用xml实现。

主要介绍xml实现的每人各科成绩查询。

接口实现：

```java
public interface EveryScoreDtoMapper{
    public IPage<EveryScoreDto> getScoreByName(Page<EveryScoreDto> page, String name);
}
```

对其进行分页操作，传入参数分别是<code>Page</code>和<code>name</code>，page用来区别当前页数及每页多少数据，name用来确定查询哪个学生的各科成绩。

xml实现：

```xml
<mapper namespace="com.example.mybatisplus.mapper.EveryScoreDtoMapper">
    <select id="getScoreByName" parameterType="String" resultType="com.example.mybatisplus.dto.EveryScoreDto">
        select student.name as studentName,
               lesson.name as lessonName,
               score.score as score
        from score,student,lesson
        where score.student_id = student.id
          and score.lesson_id = lesson.id
          and student.name=#{name}
    </select>
</mapper>
```

### service层

调用持久层方法查询数据，不多解释，没几行代码。

接口代码：

```java
public interface EveryScoreDtoService{
    public IPage<EveryScoreDto> getScoreByName(Page<EveryScoreDto> page, String name);
}
```

接口实现代码：

```java
@Service
public class EveryScoreDtoServiceImpl implements EveryScoreDtoService {
    @Autowired
    private EveryScoreDtoMapper everyScoreDtoMapper;
    @Override
    public IPage<EveryScoreDto> getScoreByName(Page<EveryScoreDto> page, String name) {
        return everyScoreDtoMapper.getScoreByName(page,name);
    }
}
```

### controller层

对外显示的接口，调用service层实现相关业务。

```java
@RestController
@RequestMapping("/score")
public class EveryScoreDtoController {
    @Autowired
    EveryScoreDtoService everyScoreDtoService;
    @GetMapping("/{name}/{page}")
    public List<EveryScoreDto> getScore(@PathVariable("page") Integer page, @PathVariable("name") String name){
        return everyScoreDtoService.getScoreByName(new Page<>(page,2),name).getRecords();
    }
}
```

### config配置

需要配置mybaties-plus的拦截器，否则分页会失败。

代码实现：

```java
@Configuration
public class MybatiesPlusConfig {
    @Bean
    public MybatisPlusInterceptor mybatisPlusInterceptor(){
        MybatisPlusInterceptor mybatisPlusInterceptor = new MybatisPlusInterceptor();
        mybatisPlusInterceptor.addInnerInterceptor(new PaginationInnerInterceptor(DbType.MYSQL));
        return mybatisPlusInterceptor;
    }
}
```

数据库使用的mysql，要指定数据库类型。

### 实现效果

![](https://cdn.xiaoliu.life/tc/20230126a/1.png)

因为数据量比较小，所以每页就两条数据，第一页显示**张三**的数学和英语成绩。

![](https://cdn.xiaoliu.life/tc/20230126a/2.png)

第二页显示**张三**的政治和科学成绩。

至此，简单的实现利用mybaties-plus插件实现对数据库的增删查改操作，以及对数据进行分页。