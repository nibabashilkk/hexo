---
title: 从0开始做游戏----cocos引擎
tags: []
id: '20221127a'
categories:
  - - 技术分享
date: 2022-11-27 15:47:34
---

最近小游戏做完了，记录一下。开发工具cocos creator，纯前端。

#### 游戏介绍

小游戏一共只有两个游戏场景，分别是开始界面和游戏界面。

**开始界面**

![屏幕截图 2022-11-27 135730](https://cdn.xiaoliu.life/tc/20221127a/屏幕截图-2022-11-27-135730.jpg)

**游戏界面**

![屏幕截图 2022-11-27 135820](https://cdn.xiaoliu.life/tc/20221127a/屏幕截图-2022-11-27-135820.jpg)

**游戏实现**

> 1.  游戏背景无限滚动（用两张背景图交替往上滚动，实现游戏背景一直在动）
> 
> 2.  自动生成新的阶梯以及小球和阶梯的碰撞事件
> 3.  屏幕触碰事件（控制小球左右移动）
> 4.  小球每下降3000像素（没搞懂单位是什么），分数加一

#### 游戏制作

**一、游戏背景无限滚动**

背景滚动主要靠两张背景图片实现，就是轮流往上移动。

![屏幕截图 2022-11-27 140621](https://cdn.xiaoliu.life/tc/20221127a/屏幕截图-2022-11-27-140621.jpg)

bg节点下挂了两个背景，通过给bg节点挂个脚本，让back1和back2一直往上移动，当移动到一定距离后就把上面的图片移动到下面，从而实现背景无限滚动。

主要实现滚动代码如下：

```typescript
update(deltaTime: number) {
let n = this.node.parent.getComponent(main).n; //获取主脚本里的变量n，用来控制滚动的速度，随着游戏的进行，n的值会越来越大，即滚动速度会越来越快，增加游戏难度。
this.back1.setPosition(0,this.back1.position.y+1+n,0);//实现back1背景滚动
this.back2.setPosition(0,this.back2.position.y+1+n,0);//实现back2背景滚动
console.log(this.back1.position);
if (this.back1.position.y>=3000){//当位置超过3000就把上面的背景移动到下面，实现无限滚动
this.back1.position = new Vec3(0,-3000,0);
}
if(this.back2.position.y>=3000){
this.back2.position = new Vec3(0,-3000,0);
}
    }
```

**二、自动生成新的阶梯以及小球和阶梯的碰撞事件**

生成阶梯通过主脚本控制，游戏中有多种阶梯，我为每一种阶梯分别写了一个脚本（应该可以公用一个，懒得改了）。即有一个公用的脚本控制不同阶梯的生成，每一个阶梯都有自己专有的脚本来控制关于自身的事件。

游戏主脚本控制随机生成阶梯代码：

```typescript
floors:Prefab[] = [];//用来存不同的阶梯的
generalfloor(){
let floor = instantiate(this.floors[Math.floor(Math.random()*(this.floors.length-1))]);//随机生成一种阶梯
floor.parent = this.node;
floor.position = new Vec3(randomRange(-380,380),-1000,0);//生成阶梯的位置随机
}
```

![floor0](https://cdn.xiaoliu.life/tc/20221127a/floor0.png)

这种是最普通的阶梯，只需要随着背景一直滚动即可。

主要实现代码：

```typescript
update(deltaTime: number) {
let self = this;
let n = this.node.parent.getComponent(main).n;//同样从主脚本里获取n值，用来控制滚动速度
        this.node.position = new Vec3(this.node.position.x,this.node.position.y+1+n,0);
if (this.node.position.y>=1000){//当阶梯从下到上超过游戏屏幕后就需要把节点删除了
setTimeout(()=>{
self.node.destroy();
},0);
}
    }
```

![floor1](https://cdn.xiaoliu.life/tc/20221127a/floor1.png)

这种比第一种特殊一点，需要实现碰撞后会由原本实心的阶梯变成半透明的阶梯，再消失。整个从实心到消失的时间设置的是三秒。

> 1.  首先需要我们制作阶梯由实心到半透明的动画
> 2.  之后节点注册碰撞函数，监听碰撞信息，当碰撞后就调用动画，让它变半透明
> 3.  最后我们删除节点，实现阶梯消失

制作动画自己百度吧，两秒就能学会，直接看代码。

```typescript
 start() {//在开始阶段注册碰撞监听
let collider = this.getComponent(Collider2D);
if (collider) {
collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
}
    }
onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact  null) {
// 只在两个碰撞体开始接触时被调用一次
if(otherCollider.node.name = "ball"){//只有小球碰撞时才会运行动画
this.getComponent(Animation).play();//动画运行
setTimeout(()=>{
if(this.node){
this.node.active = false;//三秒后让节点失效
}
},3000)
}
}

    update(deltaTime: number) {//实现阶梯上升，达到一定高度删除阶梯
let self = this;
let n = this.node.parent.getComponent(main).n;
this.node.position = new Vec3(this.node.position.x, this.node.position.y + 1 + n, 0);
if (this.node.position.y >= 1000) {
setTimeout(() => {
self.node.destroy();
}, 0);
}
    }
```

这里最大的坑就是this.node.active = false;//三秒后让节点失效，一开始没考虑全面，想着动画运行完直接删除节点得了。自己测试中发现，有时候会调用destroy失败，节点不存在。

是因为没考虑到当碰撞后，还没到三秒删除节点的时间，此时节点的高度超过1000，在updata()函数里已经把节点删除了，再等到三秒后节点就不存在了，自然删除失败。

![floor2](https://cdn.xiaoliu.life/tc/20221127a/floor2.png)

这一种阶梯看起来像弹簧一样，可以实现跳跃功能的。主要是碰撞后给小球一个向上的速度，水平速度不变。

主要代码如下：

```typescript
onBeginContact(){//碰撞回调函数
this.donghua.play();//碰撞后开始运行动画
this.ball.getComponent(RigidBody2D).linearVelocity = new Vec2(this.ball.getComponent(RigidBody2D).linearVelocity.x,20);//给小球一个向上的速度，水平速度不变
}


    update(deltaTime: number) {//实现阶梯一直向上移动，超过一定高度删除阶梯
let self = this;
let n = this.node.parent.getComponent(main).n;
this.node.position = new Vec3(this.node.position.x, this.node.position.y + 1+n, 0);
if (this.node.position.y >= 1000) {
setTimeout(() => {
self.node.destroy();
}, 0);
}
    }
```

![floor3](https://cdn.xiaoliu.life/tc/20221127a/floor3.png)

这种阶梯一碰就game over，会调用游戏的暂停函数，然后弹出来页面让你选择复活还是回到首页。

![屏幕截图 2022-11-27 144619](https://cdn.xiaoliu.life/tc/20221127a/屏幕截图-2022-11-27-144619.jpg)

主要代码实现：

```typescript
onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact  null) {
// 只在两个碰撞体开始接触时被调用一次
if(otherCollider.node.name == "ball"){//碰到小球就调用主脚本的stopgame函数用来暂停游戏
this.node.parent.getComponent(main).stopgame();
}
}

    update(deltaTime: number) {//实现阶梯上升及超过一定高度删除阶梯
let self = this;
let n = this.node.parent.getComponent(main).n;
this.node.position = new Vec3(this.node.position.x, this.node.position.y + 1 + n, 0);
if (this.node.position.y >= 1000) {
setTimeout(() => {
self.node.destroy();
}, 0);
}
    }
```

```typescript
stopgame(){
let alert = instantiate(this.floors[6]);//生成上面图片显示的弹窗
alert.setPosition(new Vec3(0,0,0));
alert.parent = this.node;
director.pause();//暂停函数
}
```

弹窗有两个按钮复活和首页。

复活按钮实现：

```typescript
click(button:Button){//复活按钮的回调函数
director.resume();//游戏恢复
let ball = this.node.parent.parent.getChildByName("ball");//小球回到起始位置
ball.setPosition(new Vec3(0,300,0));
ball.getComponent(RigidBody2D).linearVelocity = new Vec2(0,0);
this.node.parent.destroy();//删除弹窗
}
```

回到首页按钮实现：

```typescript
home(button: Button) {
director.loadScene("start");//切换到首页开始游戏的场景
this.node.parent.destroy();//删除弹窗
}
```

![floor4_01](https://cdn.xiaoliu.life/tc/20221127a/floor4_01.png)

这个阶梯是向右移动阶梯，碰撞过程中会让小球向右速度每帧加0.2。

主要代码实现：

```typescript
onPreSolve(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact  null) {//碰撞回调函数
let x = otherCollider.getComponent(RigidBody2D).linearVelocity.x;
otherCollider.getComponent(RigidBody2D).linearVelocity = new Vec2(x+0.2,0);//每次向右速度加0.2
}
    update(deltaTime: number) {//同上，懒得打说明了
let self = this;
let n = this.node.parent.getComponent(main).n;
this.node.position = new Vec3(this.node.position.x, this.node.position.y + 1+n, 0);
if (this.node.position.y >= 1000) {
setTimeout(() => {
self.node.destroy();
}, 0);
}
    }
```

![floor4_02](https://cdn.xiaoliu.life/tc/20221127a/floor4_02.png)

这个阶梯是向左移动阶梯，碰撞过程中会让小球向左速度每帧加0.2。

主要代码实现：

```typescript
onPreSolve(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact  null) {//回调函数
let x = otherCollider.getComponent(RigidBody2D).linearVelocity.x;
otherCollider.getComponent(RigidBody2D).linearVelocity = new Vec2(x - 0.2, 0);//每帧向左速度加0.2

}
    update(deltaTime: number) {//同上
let self = this;
let n = this.node.parent.getComponent(main).n;
this.node.position = new Vec3(this.node.position.x, this.node.position.y + 1+n, 0);
if (this.node.position.y >= 1000) {
setTimeout(() => {
self.node.destroy();
}, 0);
}
    }
```

![屏幕截图 2022-11-27 145939](https://cdn.xiaoliu.life/tc/20221127a/屏幕截图-2022-11-27-145939.jpg)

最后是游戏最上面的尖刺和小球掉到最底下从屏幕消失，二者都会触发游戏结束。

主要代码实现：

```typescript
onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact  null) {//碰撞到最上面的尖刺后游戏结束
if(otherCollider.node.name == "ball"){
this.node.parent.getComponent(main).stopgame();
}
}
```

```typescript
if (this.ball.position.y <= -1000) {//小球位置低于1000，即消失在屏幕里游戏结束
this.stopgame();
}
```

**三、屏幕触碰事件**

游戏主要通过触碰实现小球的向左，向右移动。实现方式很简单，注册监听函数，判断当前触摸点在左边还是右边即可。

主要代码实现：

```typescript
movestart(touch:EventTouch){//触碰一开始的回调函数
let position = touch.getUILocation();
let x = this.node.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(position.x,position.y,0)).x;//获取碰撞点的水平坐标
if(x>0){
this.ball.getComponent(RigidBody2D).linearVelocity = new Vec2(20, this.ball.getComponent(RigidBody2D).linearVelocity.y);//给向右20速度
}else{
this.ball.getComponent(RigidBody2D).linearVelocity = new Vec2(-20, this.ball.getComponent(RigidBody2D).linearVelocity.y);//给向左20速度
}
}
moveend(touch:EventTouch){//触碰结束的回调函数
this.ball.getComponent(RigidBody2D).linearVelocity = new Vec2(0, this.ball.getComponent(RigidBody2D).linearVelocity.y);//立即停止，水平速度设0，垂直速度不影响
}
```

**四、分数实现**

用一个lable标签记录当前的分数。

主要代码实现：

```typescript
update(deltaTime: number) {
this.score+=3;
let x = this.score/3000;
        this.getComponent(Label).string = Math.floor(x).toString();
    }
```

计算方式自己看吧，我也不知道具体怎么算的，反正这样写分数增加的很慢（纯要求难度）。

#### 总结

第一次做出来游戏，挺有成就感的（虽然游戏素材都是copy别人的，游戏玩法也是抄袭的，但是整个游戏代码和框架是我自己做的，这也很强了有没有）。

第一次做，大部分场景的实现还是靠百度的，虽然有官方的使用文档但一开始也看不懂好吧。

一回生二回熟，下次做一个带后端的，纯前端唯一的好处就是反应快，不过微信小游戏发布最大只能4m，这一次差一点就超了。

小游戏还在审核过程中，没发布，项目开源到我的github上了，感兴趣的可以看看。

github地址：[https://github.com/nibabashilkk/100-floors-down](https://github.com/nibabashilkk/100-floors-down)

电脑没装git，只能传个压缩包了。