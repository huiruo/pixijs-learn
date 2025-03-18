# Graphics
图形是 PixiJS 工具箱中一个复杂且容易被误解的工具。乍一看，它看起来像一个用于绘制形状的工具。确实如此！但​​它也可用于生成蒙版。它是如何工作的？

在本指南中，我们将揭开该Graphics对象的神秘面纱，从如何思考它的作用开始。


## 1.1.图形是关于构建 - 而不是绘图
PIXI.Graphics 类的首次用户常常对其工作原理感到困惑。 让我们看一个创建 Graphics 对象并绘制矩形的示例片段：

```js
// Create a Graphics object, draw a rectangle and fill it
let obj = new Graphics()
  .rect(0, 0, 200, 100)
  .fill(0xff0000);

// Add it to the stage to render
app.stage.addChild(obj);
```

该代码将起作用 - 你最终会在屏幕上看到一个红色矩形。 但当你开始思考它时，你就会感到非常困惑。 为什么我在构造对象时要绘制一个矩形？ 画画不是一次性的行为吗？ 第二帧如何绘制矩形？ 当你使用一堆 drawThis 和 drawThat 调用创建一个 Graphics 对象，然后将其用作遮罩时，情况会变得更加奇怪。 什么？??

问题在于函数名称以绘图为中心，绘图是将像素放置在屏幕上的操作。 但尽管如此，Graphics 对象实际上是关于构建的。

让我们更深入地了解一下 drawRect() 调用。 当你调用 drawRect() 时，PixiJS 实际上并没有绘制任何东西。 相反，它将你 "drew" 的矩形存储到几何图形列表中以供以后使用。 如果你随后将 Graphics 对象添加到场景中，渲染器将会出现，并要求 Graphics 对象渲染自身。 此时，你的矩形实际上已被绘制 - 以及你添加到几何列表中的任何其他形状、线条等。

一旦你明白发生了什么，事情就开始变得更有意义。 例如，当你使用 Graphics 对象作为遮罩时，遮罩系统使用几何列表中的图形基元列表来限制哪些像素进入屏幕。 没有涉及绘图。

这就是为什么将 Graphics 类视为几何构建工具而不是绘图工具会有所帮助。

## 1.2.原语类型
PIXI.Graphics 类中有很多函数，但作为快速入门，这里列出了你可以添加的基本基元：

- Line
  - 线
- Rect
  - 矩形
- RoundRect
  - 圆形矩形
- Circle
  - 圆圈
- Ellipse
  - 椭圆
- Arc
  - 弧
- Bezier and Quadratic Curve
  - 贝塞尔曲线和二次曲线

In addition, you have access to the following complex primitives: @pixi/graphics-extras
- Torus
  - 环面
- Chamfer Rect
  - 倒角矩形
- Fillet Rect
  - 圆角矩形
- Regular Polygon
  - 正多边形
- Star
  - 星星
- Rounded Polygon
  - 圆角多边形

还支持 svg。但由于 PixiJS 渲染孔洞的方式（它更注重性能），一些复杂的孔洞形状可能会渲染不正确。但对于大多数形状，这都可以解决问题！

```js
 let mySvg = new Graphics().svg(`
   <svg>
     <path d="M 100 350 q 150 -300 300 0" stroke="blue" />
   </svg>
  `);
```

### 1.3.GraphicsContext
理解 Sprite 和它们共享的 Texture 之间的关系有助于理解 的概念GraphicsContext。正如多个 Sprite 可以使用单个 Texture，通过不复制像素数据来节省内存一样，GraphicsContext 也可以在多个 Graphics 对象之间共享。

这种共享意味着GraphicsContext将图形指令转换为 GPU 就绪几何图形的密集任务只需完成一次，并且结果可以重复使用，就像纹理一样。考虑一下这些方法之间的效率差异：

1. 创建不共享上下文的单独圈子：
```js
// Create 5 circles
for (let i = 0; i < 5; i++) {
  let circle = new Graphics()
    .circle(100, 100, 50)
    .fill('red');
}
```

2. 与共享 GraphicsContext 相比：
```js
// Create a master Graphicscontext
let circleContext = new GraphicsContext()
  .circle(100, 100, 50)
  .fill('red')

// Create 5 duplicate objects
for (let i = 0; i < 5; i++) {
  // Initialize the duplicate using our circleContext
  let duplicate = new Graphics(circleContext);
}
```
现在，对于圆形和正方形来说，这可能不是什么大问题，但是当您使用 SVG 时，不必每次都重建，而是共享 就变得非常重要GraphicsContext。为了获得最佳性能，建议预先创建上下文并重复使用它们，就像纹理一样！

```js
let circleContext = new GraphicsContext()
  .circle(100, 100, 50)
  .fill('red')

let rectangleContext = new GraphicsContext()
  .rect(0, 0, 50, 50)
  .fill('red')

let frames = [circleContext, rectangleContext];
let frameIndex = 0;

const graphics = new Graphics(frames[frameIndex]);

// animate from square to circle:

function update()
{
  // swap the context - this is a very cheap operation!
  // much cheaper than clearing it each frame.
  graphics.context = frames[frameIndex++%frames.length];
}
```


<br/>

GraphicsContext如果在创建对象时未明确传递Graphics，则在内部，它将具有自己的上下文，可通过访问myGraphics.context。GraphicsContext类管理由 Graphics 父对象创建的几何图元列表。 Graphics 函数实际上是传递到内部上下文的：
```js
let circleGraphics = new Graphics()
  .circle(100, 100, 50)
  .fill('red')
```

相同于：
```js
let circleGraphics = new Graphics()

circleGraphics.context
  .circle(100, 100, 50)
  .fill('red')
```

调用Graphics.destroy()将销毁图形。如果通过构造函数将上下文传递给它，那么它将把销毁该上下文的任务留给您。但是，如果上下文是在内部创建的（默认），则在销毁时，Graphics 对象将销毁其内部的GraphicsContext。

### 1.4.显示图形
好的，现在我们已经介绍了 PIXI.Graphics 类的工作原理，接下来让我们看看如何使用它。 Graphics 对象最明显的用途是将动态生成的形状绘制到屏幕上。

这样做很简单。 创建对象，调用各种构建器函数来添加自定义基元，然后将对象添加到场景图中。 每个帧，渲染器都会出现，要求 Graphics 对象渲染自身，并且每个图元以及关联的线条和填充样式将被绘制到屏幕上。

### 1.5.图形作为蒙版
你还可以使用 Graphics 对象作为复杂蒙版。 为此，请照常构建对象和基元。 接下来创建一个将包含屏蔽内容的 PIXI.Container 对象，并将其 mask 属性设置为 Graphics 对象。 现在，容器的子项将被剪裁为仅在你创建的几何体内部显示。 该技术适用于 WebGL 和基于 Canvas 的渲染。

```text
src/views/pixi1/graphics-docs/index-mask.tsx
```

### 1.6.注意事项和陷阱
Graphics 类是一个复杂的野兽，因此在使用它时需要注意很多事情。

1. 内存泄漏： 第一个已经提到过 - 在不再需要的任何 Graphics 对象上调用 destroy() 以避免内存泄漏。

2. 洞： 你创建的孔必须完全包含在形状中，否则可能无法正确进行三角测量。

3. 改变几何形状： 如果要更改 Graphics 对象的形状，则无需删除并重新创建它。 相反，你可以使用 clear() 函数重置几何列表的内容，然后根据需要添加新的图元。 每帧执行此操作时请注意性能。

4. 性能： 图形对象通常具有相当高的性能。 但是，如果你构建高度复杂的几何体，则可能会超过渲染期间允许批处理的阈值，这可能会对性能产生负面影响。 对于批处理来说，最好使用多个 Graphics 对象，而不是使用具有多个形状的单个 Graphics。

5. 透明度： 由于 Graphics 对象按顺序渲染其基元，因此在使用混合模式或具有重叠几何体的部分透明度时要小心。 诸如 ADD 和 MULTIPLY 之类的混合模式将适用于每个图元，而不是最终的合成图片。 同样，部分透明的 Graphics 对象将显示图元重叠。 要将透明度或混合模式应用到单个展平表面，请考虑使用 AlphaFilter 或 RenderTexture。
