import { useEffect, useRef } from "react";
import { Application, Sprite, Text, TextStyle, Assets } from "pixi.js";

export const PixiGame = () => {
  const ctx = useRef<HTMLDivElement | null>(null);

  async function init() {
    const app = new Application();
    await app.init({
      width: 600,
      height: 600,
      background: "#1099bb",
    });
    return app;
  }

  useEffect(() => {
    let appInstance: Application | null = null;

    init().then((app) => {
      if (!ctx.current || appInstance) return;
      appInstance = app;
      ctx.current.appendChild(app.canvas);
      console.log("Pixi App Initialized:", app);

      const textStyle = new TextStyle({
        fontSize: 48,
        fill: "#ffffff",
        fontWeight: "bold",
      });

      // 功能1:使用新 API 创建 Text
      const text = new Text({ text: "test", style: textStyle });
      text.anchor.set(0.5);
      text.x = app.screen.width / 2;
      text.y = app.screen.height / 2;
      app.stage.addChild(text);

      // 功能2:使用 Assets.load() 加载图片
      let bunny: Sprite;
      // https://pixijs.com/assets/bunny.png
      Assets.load("./bunny.png").then((texture) => {
        // const bunny = new Sprite(texture);
        bunny = new Sprite(texture);
        bunny.anchor.set(0.5);
        bunny.x = app.screen.width / 2;
        bunny.y = app.screen.height / 2 + 100;
        app.stage.addChild(bunny);
      });

      // 功能3：让 Bunny 旋转:Listen for animate update
      app.ticker.add((ticker) => {
        if (bunny) {
          // 在 PixiJS v8 中，delta 传入的参数是 Ticker 本身，而不是之前的 number 类型的 deltaTime。
          // bunny.rotation += 0.1 * ticker.deltaTime;
          bunny.rotation += 0.02 * ticker.deltaTime; // 速度变慢
        }
      });
    });

    return () => {
      appInstance?.destroy(true);
    };
  }, []);

  return (
    <div
      style={{
        background: "grey",
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div ref={ctx}></div>
    </div>
  );
};
