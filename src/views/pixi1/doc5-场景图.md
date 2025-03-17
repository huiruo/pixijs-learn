## 场景图
每一帧，PixiJS 都会更新并渲染场景图。 让我们讨论一下场景图中的内容，以及它如何影响你开发项目的方式。 

如果你以前构建过游戏，这听起来应该非常熟悉，但如果你来自 HTML 和 DOM，那么在我们讨论可以渲染的特定对象类型之前，值得先了解一下。

### 1.1.场景图是一棵树
场景图的根节点是应用程序维护的容器，并用 app.stage 引用。

当您将精灵或其他可渲染对象作为子对象添加到舞台时，它会被添加到场景图中，并会被渲染和交互。

PixiJS Containers也可以有子节点，因此当您构建更复杂的场景时，您将得到一个以应用程序舞台为根的父子关系树。

### 1.3.父级和子级
- 当父级移动时，其子级也会移动。 
- 当父级旋转时，其子级也会旋转。 
- 隐藏父级，子级也会被隐藏。

如果您的游戏对象由多个精灵组成，您可以将它们收集在一个容器下，将它们视为世界中的单个对象，作为一个对象移动和旋转。

每一帧，PixiJS 都会从根向下遍历所有子对象到叶子，以计算每个对象的最终位置、旋转、可见性、透明度等。

1. 如果父对象的 alpha 设置为 0.5（使其 50% 透明） ，其所有子项也将从 50% 透明开始。 
   - 如果将子项设置为 0.5 alpha，则它不会是 50% 透明，而是 0.5 x 0.5 = 0.25 alpha，或 75% 透明。 

2. 同样，对象的位置是相对于其父对象的，因此如果将父对象的 x 位置设置为 50 像素，将子对象的 x 位置设置为 100 像素，则将以 150 像素的屏幕偏移量绘制对象， 或 50 + 100。

例子：
这是一个例子。 我们将创建三个精灵，每个精灵都是最后一个精灵的子级，并为它们的位置、旋转、缩放和 Alpha 设置动画。 即使每个精灵的属性设置为相同的值，父子链也会放大每个更改：

见：src/pages/pixi2/index.tsx
```js
// Create the application helper and add its render target to the page
const app = new Application();
await app.init({ width: 640, height: 360 })
document.body.appendChild(app.canvas);

// Add a container to center our sprite stack on the page
const container = new Container({
  x:app.screen.width / 2,
  y:app.screen.height / 2
});

app.stage.addChild(container);

// load the texture
await Assets.load('assets/images/sample.png');

// Create the 3 sprites, each a child of the last
const sprites = [];
let parent = container;
for (let i = 0; i < 3; i++) {
  let wrapper = new Container();
  let sprite = Sprite.from('assets/images/sample.png');
  sprite.anchor.set(0.5);
  wrapper.addChild(sprite);
  parent.addChild(wrapper);
  sprites.push(wrapper);
  parent = wrapper;
}

// Set all sprite's properties to the same value, animated over time
let elapsed = 0.0;
app.ticker.add((delta) => {
  elapsed += delta.deltaTime / 60;
  const amount = Math.sin(elapsed);
  const scale = 1.0 + 0.25 * amount;
  const alpha = 0.75 + 0.25 * amount;
  const angle = 40 * amount;
  const x = 75 * amount;
  for (let i = 0; i < sprites.length; i++) {
    const sprite = sprites[i];
    sprite.scale.set(scale);
    sprite.alpha = alpha;
    sprite.angle = angle;
    sprite.x = x;
  }
});
```

### 1.4.渲染顺序
PixiJS 从根部向下渲染树。 在每个级别，渲染当前对象，然后按插入顺序渲染每个子对象。 因此，第二个子项渲染在第一个子项之上，第三个子项渲染在第二个子项之上。

查看此示例，其中 A 下有两个父对象 A 和 D，以及两个子对象 B 和 C：

```
src/views/pixi1/index-PixiGame3.tsx
```

- 如果你想重新排序子对象，可以使用 setChildIndex()。 
- 要在父级列表中的给定点添加子级，请使用 addChildAt()。 
- 最后，你可以使用 sortableChildren 选项并结合为每个子对象设置 zIndex 属性来启用对象子对象的自动排序。

随着你对 PixiJS 的深入研究，你会遇到一个强大的功能，称为渲染组。将渲染组视为场景图中的专用容器，其作用类似于迷你场景图本身。以下是你在项目中有效使用渲染组所需了解的内容。有关更多信息，请查看渲染组概述: https://pixijs.com/8.x/guides/advanced/render-groups

### 1.5 剔除
如果你正在构建一个项目，其中大部分 DisplayObject 位于屏幕外（例如，横向滚动游戏），你将需要剔除这些对象。 剔除是评估对象（或其子对象！）是否在屏幕上的过程，如果不在屏幕上，则关闭其渲染。 如果你不剔除屏幕外的对象，渲染器仍会绘制它们，即使它们的任何像素最终都不会出现在屏幕上。

PixiJS 不提供对视口剔除的内置支持，但你可以找到可能满足你需求的第 3 方插件。 或者，如果你想构建自己的剔除系统，只需在每个刻度期间运行对象并将不需要绘制的任何对象上的 renderable 设置为 false 即可。


## 1.6 本地坐标与全局
如果您将精灵添加到舞台，默认情况下它将显示在屏幕的左上角。

这是 PixiJS 使用的全局坐标空间的原点。如果您的所有对象都是舞台的子对象，那么这就是您唯一需要担心的坐标。但是一旦您引入容器和子对象，事情就会变得更加复杂。位于 [50, 100] 的子对象距离其父对象向右 50 像素，向下 100 像素。

我们将这两个坐标系称为“全局”和“局部”坐标。当您position.set(x, y)在对象上使用时，您始终在相对于对象的父对象的局部坐标中工作。

问题是，很多时候你想知道一个对象的全局位置。例如，如果你想剔除屏幕外的对象以节省渲染时间，你需要知道给定的子对象是否在视图矩形之外。

要从局部坐标转换为全局坐标，请使用该toGlobal()函数。以下是示例用法：
```js
// Get the global position of an object, relative to the top-left of the screen
let globalPos = obj.toGlobal(new Point(0,0));
```

### 1.7.全局坐标与屏幕坐标
当你的项目使用主机操作系统或浏览器时，会出现第三个坐标系 - "screen" 坐标（又名 "viewport" 坐标）。 屏幕坐标表示相对于 PixiJS 渲染到的画布元素左上角的位置。 DOM 和原生鼠标单击事件之类的东西在屏幕空间中工作。

现在，在许多情况下，屏幕空间相当于世界空间。 如果画布的大小与创建 PIXI.Application 时指定的渲染视图的大小相同，就会出现这种情况。 默认情况下，情况就是这样 - 例如，你将创建一个 800x600 的应用窗口并将其添加到你的 HTML 页面，并且它将保持该大小。 世界坐标中的 100 个像素将等于屏幕空间中的 100 个像素。 但！ 通常会拉伸渲染的视图以使其填满屏幕，或者以较低的分辨率和较高的比例进行渲染以提高速度。 在这种情况下，canvas 元素的屏幕大小将会改变（例如通过 CSS），但底层渲染视图不会改变，从而导致世界坐标和屏幕坐标之间不匹配。
