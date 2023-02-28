---
title: jpa实现增删改查及分页操作
date: 2023-01-31 15:39:24
tags:
  - 原创
  - java
categories:
  - 技术分享
id: 20230131a
cover: https://cdn.xiaoliu.life/tc/20230131a/cover.webp
---

简单介绍下<code>jpa</code>实现对数据库的增删查改操作以及分页。

### 实体类

#### student表

学生简单有三个属性，学生id、姓名和性别。

```java
@Data
@Entity
@Builder
@Table(name = "student")
@AllArgsConstructor
@NoArgsConstructor
public class Student {
    @Id
    @Column(name = "id")
    private Integer id;
    @Column(name = "name")
    private String name;
    @Column(name = "sex")
    private String sex;
}
```

#### lesson表

记录学校课程，只有两个属性，课程id和课程名称。

```java
@Data
@Builder
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "lesson")
public class Lesson {
    @Id
    @Column(name = "id")
    private Integer id;
    @Column(name = "name")
    private String name;
}
```

#### score表

记录每个学生的各科成绩，score表通过**学生id**和**课程id**分别与学生表和课程表建立联系。

```java
@Data
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "score")
public class Score {
    @Id
    @Column(name = "score_id")
    private Integer scoreId;
    @Column(name = "student_id")
    private Integer studentId;
    @Column(name = "lesson_id")
    private Integer lessonId;
    @Column(name = "score")
    private Integer score;
}
```

#### EveryScoreDto类

业务查询中间类，用来接受查询出来的数据字段。

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

### 用jpa进行查询

主要以下介绍三种查询方式

> 1. 原生sql查询
> 2. jpql查询
> 3. specification查询

#### 原生sql查询

在**dao**层用<code>@Query</code>注解进行查询。

示例：

```java
@Query(value = "select name from lesson",nativeQuery = true)
List<String> getLessonName();
```

**注意：**默认情况下<code>nativeQuery = false</code>，表示使用<code>jpql</code>方式查询，需要自行设置。

#### jpql查询

同样在**dao**层使用<code>@Query</code>注解进行查询。

示例：

```java
@Query(value = "select student.name as studentName, lesson.name as lessonName, score.score as score from Score as score,Student as student,Lesson as lesson where score.studentId = student.id and score.lessonId = lesson.id and student.name= :name",nativeQuery = false)
Page<Map<String,Object>> getByName(String name, Pageable pageable);
```

nativeQuery可以写也可以不写，默认false。

#### specification查询

只用这种方式介绍下单表查询吧，多表联合查询是在没看懂，感觉不如直接写sql来的快。

```java
Specification<Score> specification = new Specification<Score>() {
    @Override
    public Predicate toPredicate(Root root, CriteriaQuery query, CriteriaBuilder criteriaBuilder) {
        return query.orderBy(criteriaBuilder.asc(root.get("lessonId"))).where(criteriaBuilder.greaterThanOrEqualTo(root.get("score").as(Integer.class),60)).getRestriction();
    }
};
```

这段代码是找出学生成绩大于60并按照课程id进行升序排序。

<code>criteriaBuilder</code>自带了很多方法，感兴趣的可以尝试尝试。

建议设置<code>spring.jpa.show-sql=true</code>来显示每次查询的sql语句便于找出来错误。第一次接触jpa，感觉不是很好用 (￢_￢)。

就不演示了，实现的功能和之前写的一篇**mybaties-plus**一样，mybaties实现入口：[mybaties-plus实现增删查改及分页操作 | 爱加班的小刘 (xiaoliu.life)](https://xiaoliu.life/p/20230126a.html)。

