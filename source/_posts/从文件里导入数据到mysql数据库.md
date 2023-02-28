---
title: 从文件里导入数据到mysql数据库
tags: []
id: '20221129a'
categories:
  - - 技术分享
date: 2022-11-29 22:01:42
---

从文件里导数据到mysql数据库中步骤

> 1.  首先遍历所有文件当前文件夹下所有文件
> 2.  获取每一个文件内容
> 3.  python连接数据库写数据到mysql里

#### python遍历当前目录下所有文件

```python
import os


def findAllFile(base):
    for root, ds, fs in os.walk(base):
        for f in fs:
            yield f
def main():
    base = '.'
    for i in findAllFile(base):
        print(i)
```

#### 获取每一个文件里的内容

```python
def getcontent(file):
        with open(file,'r') as f:
            list = []
            for line in f.readlines():
                list.append(line)
            f.close()
            print(list)
```

#### 连接数据库写入数据

```python
import pymysql

# 连接到数据库
con = pymysql.connect(host="你的主机IP",
                      user='用户名',
                      password="123456",
                      port=3306,
                      database='xiaohua',
                      charset='utf8'
                     )
# 创建游标
cur = con.cursor()
print(cur)
# 执行对应的sql语句
sql = "insert into students values('0001','title','content');"
cur.execute(sql)
con.commit()
cur.close() # 关闭游标
con.close() # 关闭数据库连接
```