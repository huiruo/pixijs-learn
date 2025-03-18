
# 用PixiJs实现复杂动画

那说到动画常用的技术方案无非是下面几种：

- gif图
- css3动画属性
- 原生Javascript实现
- Canvas
- WebGL

gif图和css3动画属性显然只能实现展示型动画，而通过原生代码实现交互动画又是很复杂的，同时还得考虑动画的兼容性和性能问题。WebGL因为可提供硬件加速渲染，其渲染性能肯定是高于canvas的，但考虑到canvas与WebGL兼容性对比（如下图所示）及综合我们的项目要求，最初方案选定了用Canvas实现

但交互动画的核心在于用户交互，用户交互都是基于事件的。在canvas上绘制的图形自身不支持DOM事件，只有canvas标签支持DOM事件监听，因此还需要对canvas事件进行封装，实现相对应事件的监听及处理，还挺复杂的，这时候想要是有个canvas框架就好了，网上去搜索并对比了常用的三款canvas框架fabric.js、pixi.js及Phaser.js如下：

pixi在框架量级上及渲染上都特别优秀，而且它的api简单易用，事件操作也很简单在绘制的对象上可直接操作事件，同时提供有鼠标和移动端touch事件；而fabric在渲染、事件的灵活性及端的支持上不如pixi；phaser是基于pixi封装的，在pixi优秀的渲染基础上又封装了很多游戏功能如游戏键盘手柄输入、声音支持等，所以phaser更适合做游戏，它是一款游戏引擎。

# 2.我们要创建一个动画的流程大概是这样的：
1. 创建舞台
2. 创建画布
3. 把画布挂载到DOM上
4. 创建精灵
5. 显示精灵
6. 操作精灵

### 2-1.创建舞台、画布
1. 舞台是你的创作场景中所有可见对象的根容器，我们可以将它看做一个空盒子，我们在舞台上放的内容都会在画布上呈现，且只有把要渲染的对象添加到舞台中才能被显示出来。

2. 画布就是一个渲染区域，把画布添加进DOM后，就会创建一个canvas标签，画布对象会默认选择WebGL引擎渲染模式。

pixi直接提供了一个应用类PIXI.Application可以自动创建舞台（stage）和画布（renderer），如下图所示：
```js
const app = new PIXI.Application({
  width: 600, // 渲染视图宽度
  Height:600, // 渲染视图高度
  antialiasing: true, // 抗锯齿
  transparent: false, // 背景透明
  resolution: 2, // 分辦率
  forceCanvas: false, // 是否强制使用canvas
  backgroundCoLor: Oxffffff // 视图背景色
});
```

1. app.stage就是一个舞台对象，添加渲染对象到舞台上直接app.stage.addChild(XXX)就可以了。

2. app.renderer是画布对象，如果你需要在创建canvas标签之后改变它的背景色，设置app.renderer对象的backgroundColor属性为一个任何的十六进制颜色即可
```js
app.renderer.backgroundColor = 0xffffff;
```

如果你想获取画布的宽高，直接使用app.renderer.view.width 和app.renderer.view.height即可，同时还可以用画布的resize方法重新设置画布的宽高
```js
app.renderer.autoResize = true;
app.renderer.resize(512, 512);
```

### 2-2.2、把画布挂载到DOM上
舞台和画布已经创建好，把Pixi应用中创建出来的HTMLCanvasElement（即app.view）添加到dom上，就可以在浏览器上看到白色背景的canvas渲染区了，如下图所示：
```js
document.getElementById('draw').appendChild(app.view)
```

### 3.创建精灵,往舞台上添加图,在画布上显示了
现在我们已经有了舞台和画布，就可以往舞台上添加图片，然后在画布上显示了。
> 我们把能放到舞台上的特殊图像对象称为精灵，精灵就是我们能用代码控制的图片，你能够控制他们的位置、大小、层次，用它来产生交互和动画，是pixi制作动画的关键因子。

pixi有一个精灵类PIXI.Sprite，直接在创建精灵方法中传入单个图片、或者雪碧图、或者一个包含图像信息的JSON对象都可以创建一个或多个精灵。

### 3-1.我们把可以被GPU处理的图像称作纹理,怎么加载图像并将它转化成纹理呢？
但pixi因为用WebGL和GPU去渲染图像，所以图像需要转化成GPU可以处理的形式才行，我们把可以被GPU处理的图像称作纹理。一般不能直接在PIXI.Sprite里直接传图片，要传纹理才行。而怎么加载图像并将它转化成纹理呢？Pixi提供了强大的loader对象可以通过loader把上面三种类型（单张、雪碧图、JSON）图像资源转化成纹理资源，如下面代码所示：
```js
PIXI.loader
  .add(['image1.png']) // 加载图片
  .load(setup);
// 图片加载完成时用setup的方法来使用它
function setup() {
  // 生成精灵
  let sprite = new PIXI.Sprite(
    // 图片转换成纹理
    PIXI.loader.resources['image1.png'].texture
  );
}
```

已经制作好了精灵，把精灵添加到舞台上就可以再画布显示精灵了
```js
app.stage.addChild(sprite)
```

单个精灵已经创建好了，如果你的动画场景比较复杂想管理一组图片，那么可以用PIXI.Container对象，把一组精灵聚合起来，如果要同时操控这一组精灵，直接操作container对象就可以了，如下图所示就是创建了2行2列的小鸟精灵，这些精灵都添加到了容器container中且容器在画布居中旋转：

代码如下：
```js
const container = new PIXI.Container();
app.stage.addChild(container);
const birdTexture = PIXI.Texture.fromImage('bird.png');

for (let i = 0; i < 4; i++) {
  const bird = new PIXI.Sprite(birdTexture);
  bird.width = 40
  bird.height = 40
  bird.anchor.set(0.5);
  bird.x = (i % 2) * 40;
  bird.y = Math.floor(i / 2) * 40;
  container.addChild(bird);
}

// 设置container位置
container.x = 300;
container.y = 300;
// 设置container容器原点
container.pivot.x = container.width / 2;
container.pivot.y = container.height / 2;
// 循环旋转
app.ticker.add((delta) => {
  container.rotation -= 0.01 * delta;
});
```

一个pixi实例实际上就是一个树状结构，由一个root container(app.stage)包含所有的renderable元素，而Container也可以包含其他Container


## 4.操作精灵
单个精灵或者一组精灵创建完后，就可以控制精灵的位置、大小、层次等进行动画交互了，Pixi常用的交互事件有：

1. pointer事件（兼容鼠标和触摸屏的共同触发）
2. mouse事件（鼠标触发）
3. touch事件（触摸屏触发）

事件的运用在下面的例子中会有详细介绍。这五步大概涵盖了完整动画的创建流程，下面会用一个有天空背景，鼠标拖动小鸟在天空舞动的例子介绍下pixi动画的具体实现。

## 5.实践

### 5-1.搭建舞台、画布
```js
const app = new PIXI.Application({
  width: 600,
  height: 600,
  antialias: true,
  transparent: false,
  resolution: 2,
  autoResize: true,
  backgroundColor: 0xffffff
})

const drawing: any = document.getElementById('draw')
drawing.appendChild(this.app.view)
```

### 5-2.设置蓝天背景
```js
PIXI.loader.add('sky.png').load(setup)

function setup() {
  let bgSprite = new PIXI.Sprite(PIXI.loader.resources['sky.png'].texture)
  bgSprite.width = 600
  bgSprite.height = 600
  app.stage.addChild(bgSprite);
}
```

### 5-3.添加小鸟精灵
```js
let birdSprite = new PIXI.Sprite(PIXI.loader.resources['bird.png'].texture)

birdSprite.width = 80
birdSprite.height = 80
birdSprite.position.set(20, 20) // 设置位置

app.stage.addChild(birdSprite)
```

### 5-4.拖拽小鸟舞动
```js
// 给小鸟精灵添加事件
birdSprite
.on('pointerdown', this.onDragStart)
.on('pointermove', this.onDragMove)
.on('pointerup', this.onDragEnd)
.on('pointerupoutside', this.onDragEnd)
//开始拖拽
onDragStart(event) {
  this.dragging = true
  this.data = event.data
  // 鼠标点击位置和小鸟位置的偏移量，用于移动计算
  this.diff = { x: event.data.global.x - this.x, y: event.data.global.y - this.y }
}
//拖拽移动中
onDragMove() {
  if (this.dragging) {
    const newPosition = this.data.getLocalPosition(this.parent)
    // 拖拽中保证小鸟不超过背景区域
    this.x = Math.min(Math.max(this.boundary.left || 0, newPosition.x - this.diff.x), this.boundary.right)
    this.y = Math.min(Math.max(this.boundary.top || 0, newPosition.y - this.diff.y), this.boundary.bottom)
  }
}
//拖拽完成，松开鼠标或抬起手指
onDragEnd() {
  if (this.dragging) {
    this.dragging = false
    this.data = null
  }
}
```

至此怎么用pixi实现一个交互动画就讲完了，动画场景再设置复杂点，然后加上音频模块等开发一个酷炫的小游戏也不在话下呢~。当然pixi不仅仅只有介绍的这些功能，它还支持绘制文本、绘制几何图形、支持20多种滤镜、设置遮罩层及提供动画属性等。








