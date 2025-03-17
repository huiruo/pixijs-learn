# PixiJS 层 API
https://pixijs.com/8.x/guides/advanced/render-layers

PixiJS Layer API 提供了一种强大的方法来控制对象的渲染顺序，而不受场景图中逻辑父子关系的影响。借助 RenderLayers，您可以将对象的转换方式（通过其逻辑父级）与它们在屏幕上的视觉绘制方式分离开来。

使用 RenderLayers 可确保这些元素在视觉上具有优先性，同时保持逻辑上的父子关系。示例包括：

- 具有健康条的角色：确保健康条始终显示在世界顶部，即使角色移动到物体后面。
- 分数计数器或通知等 UI 元素：无论游戏世界的复杂程度如何，都要保持它们的可见性。
- 在教程中突出显示元素：想象一下，在教程中，您需要将大多数游戏元素推回，同时突出显示特定对象。RenderLayers 可以在视觉上拆分这些元素。突出显示的对象可以放置在前景层中，以便在推回层上方进行渲染。

## 1.1.关键概念
1. 独立渲染顺序：
  - RenderLayers 允许独立于逻辑层次结构控制绘制顺序，确保按照所需的顺序渲染对象。
2. 逻辑养育保持不变：
  - 即使附加到 RenderLayers，对象仍会保持来自其逻辑父级的变换（例如位置、比例、旋转）。
3. 显式对象管理：
  - 从场景图或图层中删除对象后，必须手动将其重新分配到图层，以确保对渲染进行刻意控制。
4. 动态排序：
  - 在层内，可以使用zIndex和动态地重新排序对象，sortChildren以实现对渲染顺序的细粒度控制。

## 1.2.基本 API
首先让我们创建两个我们想要渲染的项目，红色人和蓝色人。

```js
const redGuy = new PIXI.Sprite('red guy');
redGuy.tint = 0xff0000;

const blueGuy = new PIXI.Sprite('blue guy');
blueGuy.tint = 0x0000ff;

stage.addChild(redGuy, blueGuy);
```

zIndex现在我们知道红色人会先被渲染，然后是蓝色人。现在在这个简单的例子中，你可以只对红色人和蓝色人进行排序来帮助重新排序。

但这是一个关于渲染层的指南，所以让我们创建其中一个。

用于renderLayer.attach将对象分配到图层。这将覆盖由其逻辑父级定义的对象的默认渲染顺序。

```js
// a layer..
const layer = new RenderLayer();
stage.addChild(layer);
layer.attach(redGuy);
```

所以现在我们的场景图顺序是：
```
|- stage
    |-- redGuy
    |-- blueGuy
    |-- layer
```

我们的渲染顺序是：
```
|- stage
    |-- blueGuy
    |-- layer
        |-- redGuy
```








