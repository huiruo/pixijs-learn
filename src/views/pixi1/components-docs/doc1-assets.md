
## Assets
Assets 包是旧Loader类的现代替代品。它是一种基于承诺的资源管理解决方案，可以下载、缓存和解析您的资产，使其成为您可以使用的内容。下载可以同时在后台进行，这意味着您的应用启动时间更快，缓存可确保您永远不会下载相同的资产两次，可扩展的解析器系统可让您轻松扩展和自定义流程以满足您的需求。

## 示例
要快速使用该Assets实例，您只需调用Assets.load并传入一个资源。这将返回一个承诺，该承诺在解析后将产生您寻求的值。在此示例中，我们将加载纹理，然后将其转换为精灵。

```js
import { Application, Assets, Sprite } from 'pixi.js';

// Create a new application
const app = new Application();

// Initialize the application
await app.init({ background: '#1099bb', resizeTo: window });

// Append the application canvas to the document body
document.body.appendChild(app.canvas);

// Start loading right away and create a promise
const texturePromise = Assets.load('https://pixijs.com/assets/bunny.png');

// When the promise resolves, we have the texture!
texturePromise.then((resolvedTexture) =>
{
    // create a new Sprite from the resolved loaded Texture
    const bunny = Sprite.from(resolvedTexture);

    // center the sprite's anchor point
    bunny.anchor.set(0.5);

    // move the sprite to the center of the screen
    bunny.x = app.screen.width / 2;
    bunny.y = app.screen.height / 2;

    app.stage.addChild(bunny);
});
```

使用时要记住的一件非常重要的事情Assets是，所有请求都会被缓存，如果 URL 相同，则返回的承诺也将相同。在代码中显示它：
```js
promise1 = Assets.load('bunny.png')
promise2 = Assets.load('bunny.png')
// promise1 === promise2
```


### 1.2 使用 Async/ 
有一种使用承诺的方法更直观、更易于阅读：async/ await。

```js
// Create a new application
const app = new Application();
// Initialize the application
await app.init({ background: '#1099bb', resizeTo: window });
// Append the application canvas to the document body
document.body.appendChild(app.canvas);
const texture = await Assets.load('https://pixijs.com/assets/bunny.png');
// Create a new Sprite from the awaited loaded Texture
const bunny = Sprite.from(texture);
// Center the sprite's anchor point
bunny.anchor.set(0.5);
// Move the sprite to the center of the screen
bunny.x = app.screen.width / 2;
bunny.y = app.screen.height / 2;
app.stage.addChild(bunny);
```

### 1.2.加载多个资产
我们可以将资源添加到缓存中，然后使用Assets.add(...)并调用Assets.load(...)所有要加载的键同时加载它们。请参阅以下示例：
```js
// Append the application canvas to the document body
document.body.appendChild(app.canvas);
// Add the assets to load
Assets.add({ alias: 'flowerTop', src: 'https://pixijs.com/assets/flowerTop.png' });
Assets.add({ alias: 'eggHead', src: 'https://pixijs.com/assets/eggHead.png' });
// Load the assets and get a resolved promise once both are loaded
const texturesPromise = Assets.load(['flowerTop', 'eggHead']); // => Promise<{flowerTop: Texture, eggHead: Texture}>
// When the promise resolves, we have the texture!
texturesPromise.then((textures) =>
{
    // Create a new Sprite from the resolved loaded Textures
    const flower = Sprite.from(textures.flowerTop);
    flower.anchor.set(0.5);
    flower.x = app.screen.width * 0.25;
    flower.y = app.screen.height / 2;
    app.stage.addChild(flower);
    const egg = Sprite.from(textures.eggHead);
    egg.anchor.set(0.5);
    egg.x = app.screen.width * 0.75;
    egg.y = app.screen.height / 2;
    app.stage.addChild(egg);
});
```

但是，如果你想充分利用它，@pixi/Assets你应该使用 bundles。Bundles 只是一种将资源组合在一起的方法，可以通过调用Assets.addBundle(...)/手动添加Assets.loadBundle(...)。
```js
  Assets.addBundle('animals', {
    bunny: 'bunny.png',
    chicken: 'chicken.png',
    thumper: 'thumper.png',
  });

 const assets = await Assets.loadBundle('animals');
```

然而，处理包的最佳方式是使用清单并Assets.init({manifest})使用该清单进行调用（或者更好的是，指向它的 URL）。将我们的资产拆分成与我们应用的屏幕或阶段相对应的包，这将非常方便，因为可以在用户使用应用时在后台加载，而不是将它们锁定在单个整体加载屏幕中。
```js
{
   "bundles":[
      {
         "name":"load-screen",
         "assets":[
            {
               "alias":"background",
               "src":"sunset.png"
            },
            {
               "alias":"bar",
               "src":"load-bar.{png,webp}"
            }
         ]
      },
      {
         "name":"game-screen",
         "assets":[
            {
               "alias":"character",
               "src":"robot.png"
            },
            {
               "alias":"enemy",
               "src":"bad-guy.png"
            }
         ]
      }
   ]
}

// 请注意您只能call init一次。
Assets.init({manifest: "path/manifest.json"});
```

请记住，重复 URL 没有任何坏处，因为它们都会被缓存，所以如果您需要两个捆绑包中的相同资产，您可以重复请求而无需任何额外成本！


### 1.3.后台加载
旧的加载方法是Loader在应用程序开始时加载所有资产，但现在用户不太有耐心，希望内容能够立即可用，因此做法是加载向用户显示某些内容所需的最低限度，并且在他们与该内容交互时，我们会在后台继续加载以下内容。

幸运的是，Assets我们有一个系统可以让我们在后台加载所有内容，如果我们现在需要某些资产，可以将它们移到队列顶部，这样我们就可以最大限度地缩短加载时间。

为了实现这一点，我们有方法Assets.backgroundLoad(...)和，Assets.backgroundLoadBundle(...)它们将在后台被动地开始加载这些资产。因此，当您最终开始加载它们时，您将获得一个承诺，该承诺会立即解析已加载的资产。

当你最终需要显示资产时，你调用通常的Assets.load(...)或Assets.loadBundle(...)，你就会得到相应的承诺。

最好的方法是使用捆绑包，请参见以下示例：
```js
import { Application, Assets, Sprite } from 'pixi.js';

// Create a new application
const app = new Application();

async function init()
{
    // Initialize the application
    await app.init({ background: '#1099bb', resizeTo: window });

    // Append the application canvas to the document body
    document.body.appendChild(app.canvas);

    // Manifest example
    const manifestExample = {
        bundles: [
            {
                name: 'load-screen',
                assets: [
                    {
                        alias: 'flowerTop',
                        src: 'https://pixijs.com/assets/flowerTop.png',
                    },
                ],
            },
            {
                name: 'game-screen',
                assets: [
                    {
                        alias: 'eggHead',
                        src: 'https://pixijs.com/assets/eggHead.png',
                    },
                ],
            },
        ],
    };

    await Assets.init({ manifest: manifestExample });

    // Bundles can be loaded in the background too!
    Assets.backgroundLoadBundle(['load-screen', 'game-screen']);
}

init();
```





