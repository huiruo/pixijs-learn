import { useEffect, useRef } from "react";
import { Application, Assets, Container, Graphics, Sprite, Text } from "pixi.js";

export const PixiMask1 = () => {
  const ctx = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let app: Application | null = null;

    async function init() {
      app = new Application();
      globalThis.__PIXI_APP__ = app;

      await app.init({
        background: "#fff",
        resizeTo: window,
      });

      if (!ctx.current) return;
      ctx.current.appendChild(app.canvas);

      app.stage.eventMode = "static";

      // Load textures
      await Assets.load([
        "https://pixijs.com/assets/bg_rotate.jpg",
        "https://pixijs.com/assets/bg_scene_rotate.jpg",
        "https://pixijs.com/assets/light_rotate_2.png",
        "https://pixijs.com/assets/light_rotate_1.png",
        "https://pixijs.com/assets/panda.png",
      ]);

      // 背景图
      const bg = Sprite.from("https://pixijs.com/assets/bg_rotate.jpg");
      bg.anchor.set(0.5);
      bg.x = app.screen.width / 2;
      bg.y = app.screen.height / 2;
      app.stage.addChild(bg);

      // 容器
      const container = new Container();
      container.x = app.screen.width / 2;
      container.y = app.screen.height / 2;

      // 加载多个精灵
      const bgFront = Sprite.from("https://pixijs.com/assets/bg_scene_rotate.jpg");
      bgFront.anchor.set(0.5);

      const light2 = Sprite.from("https://pixijs.com/assets/light_rotate_2.png");
      light2.anchor.set(0.5);

      const light1 = Sprite.from("https://pixijs.com/assets/light_rotate_1.png");
      light1.anchor.set(0.5);

      const panda = Sprite.from("https://pixijs.com/assets/panda.png");
      panda.anchor.set(0.5);

      container.addChild(bgFront, light2, light1, panda);
      app.stage.addChild(container);

      // 创建遮罩
      const maskGraphics = new Graphics();
      maskGraphics.x = app.screen.width / 2;
      maskGraphics.y = app.screen.height / 2;
      app.stage.addChild(maskGraphics);

      container.mask = maskGraphics;

      let count = 0;
      app.stage.on("pointertap", () => {
        container.mask = container.mask ? null : maskGraphics;
      });

      // 说明文字
      const help = new Text({
        text: "Click or tap to toggle mask.",
        style: {
          fontFamily: "Arial",
          fontSize: 14,
          fontWeight: "bold",
          fill: "black",
        },
      });

      help.y = app.screen.height - 26;
      help.x = 10;
      app.stage.addChild(help);

      // 动画逻辑
      app.ticker.add(() => {
        bg.rotation += 0.01;
        bgFront.rotation -= 0.01;

        light1.rotation += 0.02;
        light2.rotation += 0.01;

        panda.scale.x = 1 + Math.sin(count) * 0.04;
        panda.scale.y = 1 + Math.cos(count) * 0.04;

        count += 0.1;

        maskGraphics.clear();
        maskGraphics.moveTo(-120 + Math.sin(count) * 20, -100 + Math.cos(count) * 20);
        maskGraphics.lineTo(120 + Math.cos(count) * 20, -100 + Math.sin(count) * 20);
        maskGraphics.lineTo(120 + Math.sin(count) * 20, 100 + Math.cos(count) * 20);
        maskGraphics.lineTo(-120 + Math.cos(count) * 20, 100 + Math.sin(count) * 20);
        maskGraphics.fill({ color: 0x8bc5ff, alpha: 0.4 });
        maskGraphics.rotation = count * 0.1;
      });
    }

    init();

    return () => {
      app?.destroy(true);
    };
  }, []);

  return (
    <div
      style={{
        background: "grey",
        height: "500px",
        width: "100%",
      }}
    >
      <div ref={ctx}></div>
    </div>
  );
};
