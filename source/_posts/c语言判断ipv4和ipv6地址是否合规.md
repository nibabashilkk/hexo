---
title: c语言判断ipv4和ipv6地址是否合规
tags: []
id: '20221010a'
categories:
  - - 技术分享
date: 2022-10-10 17:25:48
---

c语言判断ipv4和ipv6是否合法

```c
bool IsIpv4(char \*str){

    char\* ptr;

    int count = 0;

const char \*p = str;

char \*q;

q = (char \*)malloc(sizeof(char)\*(strlen(str)+1));

strcpy(q,str);防止对str字符串更改

    while(\*p !='\\0')//判断是否有三个’.’

    {

        if(\*p == '.')

        count++;

        p++;

    }

    if(count != 3)  return false;

    count = 0;

    ptr = strtok(str,".");

    while(ptr != NULL)//以’.’作为分割符对字符串进行分割

    {   

        count++;

        if(strspn(ptr,”0123456789”)!=strlen(ptr)) return false;//判断分割后的字符串中是否全为数字。

If(ptr\[0\] == ‘0’&&strlen(ptr)!=1)return false;//首个数字不应该为0；

        int a = atoi(ptr);

        if(a<0 a>255) return false;

        ptr = strtok(NULL,".");

    }

    if(count == 4)  return true;

    else  return false;

}

bool IsIpv6(\*str){

Int n = 0;

Int flag = 0;

Int num = 0;

for(int i=0;i<strlen(str),i++){

If(str\[i\] == ‘:’){

If(n>4)return false;

Else if (n == 0){

num++;

If(num>1)return false;

}

n=0;

flag++;

}

else if (!( s\[i\]<='9' && s\[i\]>='0's\[i\]<='F' && s\[i\]>='A's\[i\]<='f' && s\[i\]>='a'))

}

else n++;

}

if (num == 0 && flag!=7)return false;

if (num == 1 && flag > 6)return false;

Return true;

}
```

