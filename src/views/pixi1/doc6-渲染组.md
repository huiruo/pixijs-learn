
# 渲染组
随着你对 PixiJS 的深入研究，尤其是版本 8，你会遇到一个强大的功能，称为 RenderGroups。将 RenderGroups 视为场景图中的专用容器，其作用类似于迷你场景图本身。以下是你在项目中有效使用 Render Groups 所需了解的内容：

## 1.1.什么是渲染组
渲染组本质上是容器，PixiJS 将其视为独立的场景图。当您将场景的各个部分分配给渲染组时，您就是在告诉 PixiJS 将这些对象作为一个单元一起管理。这种管理包括监视更改并专门为该组准备一组渲染指令。这是一个优化渲染过程的强大工具。


## 1.2.为什么要使用渲染组
使用渲染组的主要优势在于其优化功能。它们允许将某些计算（如变换（位置、缩放、旋转）、色调和 alpha 调整）卸载到 GPU。这意味着移动或调整渲染组等操作可以对 CPU 产生最小影响，从而使您的应用程序更高效地运行。

实际上，即使没有明确意识到，您也会使用渲染组。您传递给 PixiJS 中的渲染函数的根元素会自动转换为渲染组，因为这是存储其渲染指令的地方。不过，您也可以根据需要明确创建其他渲染组，以进一步优化您的项目。

此功能特别适用于：
1. 静态内容：对于不经常更改的内容，渲染组可以显著减少 CPU 的计算负载。在这种情况下，静态指的是场景图结构，而不是其中 PixiJS 元素的实际值（例如位置、事物的比例）。

2. 独特的场景部分：您可以将场景分成逻辑部分，例如游戏世界和 HUD（平视显示器）。每个部分都可以单独优化，从而提高整体性能。

```js
const myGameWorld = new Container({
  isRenderGroup:true
})

const myHud = new Container({
  isRenderGroup:true
})

scene.addChild(myGameWorld, myHud)

renderer.render(scene) // this action will actually convert the scene to a render group under the hood
```

