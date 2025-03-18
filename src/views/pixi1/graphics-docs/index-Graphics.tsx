import { useEffect, useRef } from "react";
import { Application, Graphics } from "pixi.js";

export const PixiGraphics = () => {
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

      // 创建 Graphics
      const graphics = new Graphics();

      // 矩形
      graphics.rect(50, 50, 100, 100).fill(0xde3249);
      graphics.rect(200, 50, 100, 100).fill(0x650a5a).stroke({ width: 2, color: 0xfeeb77 });
      graphics.rect(350, 50, 100, 100).fill(0xc34288).stroke({ width: 10, color: 0xffbd01 });
      graphics.rect(530, 50, 140, 100).fill(0xaa4f08).stroke({ width: 2, color: 0xffffff });

      // 圆形
      graphics.circle(100, 250, 50).fill(0xde3249, 1);
      graphics.circle(250, 250, 50).fill(0x650a5a, 1).stroke({ width: 2, color: 0xfeeb77 });
      graphics.circle(400, 250, 50).fill(0xc34288, 1).stroke({ width: 10, color: 0xffbd01 });

      // 椭圆
      graphics.ellipse(600, 250, 80, 50).fill(0xaa4f08, 1).stroke({ width: 2, color: 0xffffff });

      // 画三角形
      graphics.moveTo(50, 350).lineTo(250, 350).lineTo(100, 400).lineTo(50, 350);
      graphics.fill(0xff3300).stroke({ width: 4, color: 0xffd900 });

      // 圆角矩形
      graphics.roundRect(50, 440, 100, 100, 16).fill(0x650a5a, 0.25).stroke({ width: 2, color: 0xff00ff });

      // 星形
      graphics.star(360, 370, 5, 50).fill(0x35cc5a).stroke({ width: 2, color: 0xffffff });
      graphics.star(280, 510, 7, 50).fill(0xffcc5a).stroke({ width: 2, color: 0xfffffd });
      graphics.star(470, 450, 4, 50).fill(0x55335a).stroke({ width: 4, color: 0xffffff });

      // 多边形
      const path = [600, 370, 700, 460, 780, 420, 730, 570, 590, 520];
      graphics.poly(path).fill(0x3500fa);

      app.stage.addChild(graphics);
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
