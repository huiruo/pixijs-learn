import { useEffect, useRef } from "react";
import { Application, Sprite } from "pixi.js";

export const PixiExample1 = () => {
  const ctx = useRef<HTMLDivElement | null>(null);

  async function init() {
    const app = new Application();
    await app.init({
      // background: "#1099bb",
      // resizeTo: window,
      width: 600,
      height: 600,
    });
    return app;
  }

  useEffect(() => {
    let appInstance: Application | null = null;

    init().then((app) => {
      if (!ctx.current || appInstance) return;
      appInstance = app;

      // 试用 Pixi 官方图片
      const bunny = Sprite.from("https://pixijs.com/assets/bunny.png");

      // // 设置锚点为中心
      // bunny.anchor.set(0.5);

      // // 设置初始位置到屏幕中心
      // bunny.x = app.screen.width / 2;
      // bunny.y = app.screen.height / 2;

      // // 添加到舞台
      // app.stage.addChild(bunny);

      // add to stage
      app.stage.addChild(bunny);

      // center the sprite's anchor point
      bunny.anchor.set(0.5);

      // move the sprite to the center of the screen
      bunny.x = app.screen.width / 2;
      bunny.y = app.screen.height / 2;
      
      ctx.current.appendChild(app.canvas);
      console.log("Pixi App Initialized:", app);

      // 触发窗口 resize 事件，确保 Pixi 画布尺寸正确
      // setTimeout(() => {
      //   window.dispatchEvent(new Event("resize"));
      // }, 100);
    });

    return () => {
      appInstance?.destroy(true); // 清理 Pixi 实例，防止重复渲染
    };
  }, []);

  return (
    <div
      style={{
        background: "grey",
        height: "500px",
        width: "50vw",
      }}
    >
      test
      <div ref={ctx}></div>
    </div>
  );
};
