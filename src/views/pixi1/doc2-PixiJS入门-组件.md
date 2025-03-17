
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


