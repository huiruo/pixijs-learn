
## Sprite 是一种 DisplayObject
在 PixiJS 中绘制图片的方法有很多种，但最简单的是使用 精灵。 

我们将在后面的指南中详细介绍场景图的工作原理，但现在你需要知道的是 PixiJS 渲染 DisplayObjects 的层次结构。 

Sprite 是一种 DisplayObject，它封装加载的图片资源以允许对其进行绘制、缩放、旋转等

在 PixiJS 渲染图片之前，需要先加载图片。 就像在任何网页中一样，图片加载是异步发生的。 我们将在后面的指南中详细讨论资源加载。 现在，我们可以使用 PIXI.Sprite 类上的辅助方法来处理图片加载：

```js
const bunny = PIXI.Sprite.from('https://pixi.nodejs.cn/assets/bunny.png')
```

然后我们需要将新的精灵添加到舞台上。 舞台只是一个 容器，它是场景图的根。 舞台容器的每个子级都将在每一帧进行渲染。 通过将精灵添加到舞台，我们告诉 PixiJS 的渲染器我们想要绘制它。
```js
app.stage.addChild(bunny)
```

## 编写更新循环
```js
// Listen for animate update
app.ticker.add((delta) => {
    // just for fun, let's rotate mr rabbit a little
    // delta is 1 if running at 100% performance
    // creates frame-independent transformation
    bunny.rotation += 0.1 * delta;
});
```

你需要做的就是调用 app.ticker.add(...)，向其传递一个回调函数，然后在该函数中更新你的场景。 每一帧都会调用它，你可以移动、旋转等任何你想要驱动项目动画的方式。

## 在v8 版本中
在 PixiJS v8 中，delta 传入的参数是 Ticker 本身，而不是之前的 number 类型的 deltaTime。
```js
// 让 Bunny 旋转
app.ticker.add((ticker) => {
  if (bunny) {
    // 在 PixiJS v8 中，delta 传入的参数是 Ticker 本身，而不是之前的 number 类型的 deltaTime。
    // bunny.rotation += 0.1 * ticker.deltaTime;
    bunny.rotation += 0.02 * ticker.deltaTime; // 速度变慢
  }
});
```

### app.ticker.add
app.ticker.add 适用于 需要每帧更新的逻辑，比如动画、物理计算、状态更新等。以下是一些适合放在 app.ticker.add 里的功能：

✅ 适合的功能:
1️⃣ 物体动画（旋转、缩放、移动）
```js
app.ticker.add((ticker) => {
  bunny.rotation += 0.02 * ticker.deltaTime; // 让 Bunny 旋转
  bunny.x += 1 * ticker.deltaTime; // 让 Bunny 向右移动
});
```

2️⃣ 物理模拟（如重力、速度计算）
```js
const gravity = 0.5;
let velocityY = 0;

app.ticker.add((ticker) => {
  velocityY += gravity; // 模拟重力加速度
  bunny.y += velocityY * ticker.deltaTime; // 让 Bunny 下落
});
```

3️⃣ 让物体跟随鼠标
```js
app.ticker.add(() => {
  bunny.x += (app.renderer.plugins.interaction.mouse.global.x - bunny.x) * 0.1;
  bunny.y += (app.renderer.plugins.interaction.mouse.global.y - bunny.y) * 0.1;
});
```

4️⃣ 帧率相关的时间计算
```js
let elapsed = 0;
app.ticker.add((ticker) => {
  elapsed += ticker.deltaTime;
  if (elapsed > 60) { // 60帧后执行一次
    console.log("1秒过去了");
    elapsed = 0;
  }
});
```

5️⃣ 粒子效果
```js
app.ticker.add((ticker) => {
  particles.forEach((particle) => {
    particle.x += particle.vx * ticker.deltaTime;
    particle.y += particle.vy * ticker.deltaTime;
  });
});
```


