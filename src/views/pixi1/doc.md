
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