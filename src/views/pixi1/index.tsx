import { useEffect, useRef } from "react";
import { Application, Sprite, Text, TextStyle, Assets } from "pixi.js";

export const PixiExample1 = () => {
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

      // 创建 Pixi 文字样式
      const textStyle = new TextStyle({
        fontSize: 48,
        fill: "#ffffff",
        fontWeight: "bold",
      });

      // 使用新 API 创建 Text
      const text = new Text({ text: "test", style: textStyle });
      text.anchor.set(0.5);
      text.x = app.screen.width / 2;
      text.y = app.screen.height / 2;
      app.stage.addChild(text);

      // 使用 Assets.load() 加载图片
      Assets.load("https://pixijs.com/assets/bunny.png").then((texture) => {
        const bunny = new Sprite(texture);
        bunny.anchor.set(0.5);
        bunny.x = app.screen.width / 2;
        bunny.y = app.screen.height / 2 + 100;
        app.stage.addChild(bunny);
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
