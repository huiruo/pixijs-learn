# 缓存为纹理

## 1.1.cacheAsTexture在pixijs使用
PixiJS 中的函数cacheAsTexture是优化应用程序中渲染的强大工具。通过将容器及其子项渲染到纹理，cacheAsTexture可以显著提高静态或不经常更新的容器的性能。让我们探索如何有效地使用它，以及它的好处和注意事项。

```
cacheAsTexture是 PixiJS v8 中与之前cacheAsBitmap功能相同的版本。如果您从 v7 或更早版本迁移，只需在代码中将其替换cacheAsBitmap为即可。cacheAsTexture
```

当您设置 时container.cacheAsTexture()，容器将被渲染到纹理。后续渲染将重用此纹理，而不是渲染容器的所有单个子项。这种方法对于具有许多静态元素的容器特别有用，因为它减少了渲染工作量。

要在对容器进行更改后更新纹理，请调用：
```js
container.updateCacheTexture();
```
要关闭它，请调用：
```js
container.cacheAsTexture(false);
```

## 1.1.下面是一个演示如何使用的示例cacheAsTexture：
在这个例子中，container及其子项被渲染到单个纹理，从而减少了绘制场景时的渲染开销。
```js
import * as PIXI from 'pixi.js';

(async () =>
{
    // Create a new application
    const app = new Application();

    // Initialize the application
    await app.init({ background: '#1099bb', resizeTo: window });

    // Append the application canvas to the document body
    document.body.appendChild(app.canvas);

    // load sprite sheet..
    await Assets.load('https://pixijs.com/assets/spritesheet/monsters.json');

    // holder to store aliens
    const aliens = [];
    const alienFrames = ['eggHead.png', 'flowerTop.png', 'helmlok.png', 'skully.png'];

    let count = 0;

    // create an empty container
    const alienContainer = new Container();

    alienContainer.x = 400;
    alienContainer.y = 300;

    app.stage.addChild(alienContainer);

    // add a bunch of aliens with textures from image paths
    for (let i = 0; i < 100; i++)
    {
        const frameName = alienFrames[i % 4];

        // create an alien using the frame name..
        const alien = Sprite.from(frameName);

        alien.tint = Math.random() * 0xffffff;

        alien.x = Math.random() * 800 - 400;
        alien.y = Math.random() * 600 - 300;
        alien.anchor.x = 0.5;
        alien.anchor.y = 0.5;
        aliens.push(alien);
        alienContainer.addChild(alien);
    }

    // this will cache the container and its children as a single texture
    // so instead of drawing 100 sprites, it will draw a single texture!
    alienContainer.cacheAsTexture()
})();
```



