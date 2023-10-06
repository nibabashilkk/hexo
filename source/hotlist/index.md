---
title: 摸鱼热榜
date: 2023-02-05 17:44:31
aside: false
---

<script>
function getdata(){
    fetch('https://www.zhihu.com/api/v3/feed/topstory/hot-lists/total?limit=50',{mode:'cors'}).then(res => res.json()).then(data=>{
        console.log(data)
    })
}
</script>