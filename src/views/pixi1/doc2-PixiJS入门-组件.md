# 基础
https://github.com/fefeding/pixigame

pixi.js - v4.5.5 版本：

- PIXI.Application 创建一个游戏时第一个要初始化的对象。
- stage 舞台，我们可以看做是所有对象的根节点，类似于document。
- PIXI.loader 资源加载和管理器。
- PIXI.Texture 材质，通常是指我们加载的图片。
- PIXI.Sprite 精灵，就是游戏中的一个对象，结合PIXI.Texture 材质使用。
- PIXI.extras.AnimatedSprite 动画精灵，可以设置多个图片，按序播放。
- PIXI.Container 精灵容器，我们可以把多个精灵结合在一起组成一个更复杂的对象。

### 初始化PixiJS
```js
var opt = {
    width: window.innerWidth,
    height: window.innerHeight,
    antialias: true,    // default: false
    transparent: false, // default: false
    resolution: 1       // default: 1
};
//生成app对象，指定宽高，这里直接全屏
var app = new PIXI.Application(opt);
app.renderer.backgroundColor = 0xffffff;
app.renderer.autoResize = true;
//这里使用app生成的app.view(canvas)
document.body.appendChild(app.view);
//这里是APP的ticker，会不断调用此回调
//我们在这里去调用游戏的状态更新函数
app.ticker.add(function(delta) {
    //理论上要用delta去做时间状态处理，我们这里比较简单就不去处理时间问题了
    //每次执行都当做一个有效的更新
    game.update(delta);
});
```

### 资源加载
加载资源使用PIXI.loader，支持单个图片，或雪碧图的配置json文件。

```js
PIXI.loader
.add(name1, 'img/bg_1-min.jpg')
.add(name2, 'img/love.json').load(function(){
    //加载完
});
```

雪碧图和其json配置文件可以用工具TexturePackerGUI来生成， 格式如下:
```json
{"frames": {

"bomb.png":
{
	"frame": {"x":0,"y":240,"w":192,"h":192},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":192,"h":192},
	"sourceSize": {"w":192,"h":192}
},
...//省略多个
"x.png":
{
	"frame": {"x":576,"y":240,"w":192,"h":192},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":192,"h":192},
	"sourceSize": {"w":192,"h":192}
}},
"animations": {
	"m": ["m1.png","m2.png"]
},
"meta": {
	"app": "https://www.codeandweb.com/texturepacker",
	"version": "1.0",
	"image": "love.png?201902132001",
	"format": "RGBA8888",
	"size": {"w":768,"h":432},
	"scale": "1",
	"smartupdate": "$TexturePacker:SmartUpdate:5bb8625ec2f5c0ee2a84ed4f5a6ad212:f3955dc7846d47f763b8c969f5e7bed3:7f84f9b657b57037d77ff46252171049$"
}
}
```

### 精灵
加载完资源后，我们就可以用PIXI.loader.resources读取资源，制作一个普通精灵。
```js
var textures = PIXI.loader.resources['qq'].textures;
var sprite = new PIXI.Sprite(textures['qq_head.png']);
```

### 动画
跟上面普通精灵类似，只是使用多个图片做为侦。然后用PIXI.extras.AnimatedSprite来播放。 例如下面我们取雪碧图中f开头的图片组成一个动画。 资源图:
```js
var textures = PIXI.loader.resources['bling'];
var expTextures = [];//当前动画所有材质集合
var keys = textures.data.animations['f'];
//按索引排个序，以免侦次序乱了
keys.sort(function(k1,k2){
    return k1.replace(/[^\d]/g,'') - k2.replace(/[^\d]/g,'');
});
for(var i=0;i<keys.length;i++) {
    var t = textures[keys[i]];
    expTextures.push(t);
}
var side = new PIXI.extras.AnimatedSprite(expTextures);
side.animationSpeed = 0.15;//指定其播放速度
app.stage.addChild(side);
//其它接口请查看官方文档
```

### 状态更新
每个对象都有一个update函数，都在这里自已更新自已的位置和状态(update由app.ticker定时调用)。所有对外开放的状态设置都提供接口，比如die、move等。 如下：
```js
this.die = function() {
    this.state = 'dead';
    this.sprite.visible = false;
    map.removeBob(this);
}
//发生碰撞，炸弹会导致气球破裂
this.hitEnd = function() {
    //气球破裂
    heart.break(function(){
        console.log('我跟气球撞了');
    });
}
//更新炸弹状态
this.update = function(delta) {
    //计算当前在屏幕中的坐标
    var p = map.toLocalPosition(this.position.x, this.position.y);
    //运行中，障碍物到屏幕时才需要显示
    if(game.state == 'play' && p.y >= -this.sprite.height) {
        this.start();
    }
    if(!this.sprite.visible) return;
    //移动精灵
    this.sprite.x = p.x;
    this.sprite.y = p.y;
    //出了屏外，则不需要再显示
    if(p.y > game.app.screen.height) {
        this.die();
        return;
    }
    //如果碰到当前精灵，则精灵死
    if(heart.hitTest(this)) {
        this.hitEnd();
    }
    this.position.y += this.vy; //保持自身的速度
}
```


# 组件
https://pixi.nodejs.cn/guides/basics/architecture-overview

PixiJS 是一个模块化渲染引擎。 生成、更新和显示内容所需的每个任务都被分解为自己的组件。 这不仅使代码更清晰，而且还提供了更大的可扩展性。 此外，通过使用 PixiJS 定制工具，可以构建仅包含项目所需功能子集的自定义 PixiJS 文件，从而节省下载大小。

以下是构成 PixiJS 的主要组件的列表:

### 1.1.渲染器 @pixi/core	
PixiJS 系统的核心是渲染器，它显示场景图并将其绘制到屏幕上。 PixiJS 的默认渲染器底层基于 WebGL。

### 1.2.容器 @pixi/display
创建场景图的主显示对象： 要显示的可渲染对象树，例如精灵、图形和文本。 详细信息请参见 场景图。

https://pixi.nodejs.cn/guides/basics/scene-graph


### 1.3.加载器 @pixi/loader	
加载器系统提供了异步加载图片和音频文件等资源的工具。

### 1.4.股票行情指示器 @pixi/ticker	
代码提供基于时钟的定期回调。 你的游戏更新逻辑通常会响应每帧一次的勾选而运行。 你可以同时使用多个代码。

### 1.5.应用 @pixi/app	
该应用是一个简单的辅助程序，它将加载器、Ticker 和 Renderer 封装到一个方便易用的对象中。 非常适合快速入门、原型设计和构建简单的项目。

### 1.6.互动 @pixi/interaction
PixiJS 支持触摸和基于鼠标的交互 - 使对象可点击、触发悬停事件等。

### 1.7.无障碍 @pixi/accessibility	
我们的显示系统中包含了一组丰富的工具，用于实现键盘和屏幕阅读器的可访问性。


