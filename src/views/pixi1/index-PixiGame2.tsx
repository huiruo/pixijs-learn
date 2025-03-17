import { useEffect, useRef } from "react";
import { Application, Sprite, Assets, Container } from "pixi.js";

export const PixiGame2 = () => {
  const ctx = useRef<HTMLDivElement | null>(null);

  async function init() {
    const app = new Application();

    globalThis.__PIXI_APP__ = app;

    await app.init({
      width: 600,
      height: 600,
      background: "#1099bb",
    });
    return app;
  }

  useEffect(() => {
    let appInstance: Application | null = null;

    init().then(async (app) => {
      if (!ctx.current || appInstance) return;
      appInstance = app;
      ctx.current.appendChild(app.canvas);
      console.log("Pixi App Initialized:", app);

      // 创建 Container 并添加到舞台
      const container = new Container();
      container.x = app.screen.width / 2;
      container.y = app.screen.height / 2;
      app.stage.addChild(container);

      // 加载新纹理
      const texture = await Assets.load("./bunny2.png");

      // 创建3个嵌套的 Container 和 Sprite
      const sprites: Container[] = [];
      let parent = container;
      for (let i = 0; i < 3; i++) {
        const wrapper = new Container();
        const sprite = new Sprite(texture);
        sprite.anchor.set(0.5);
        wrapper.addChild(sprite);
        parent.addChild(wrapper);
        sprites.push(wrapper);
        parent = wrapper;
      }

      let elapsed = 0.0;
      app.ticker.add((ticker) => {
        elapsed += ticker.deltaTime / 60;
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
