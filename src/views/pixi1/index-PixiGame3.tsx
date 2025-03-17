import { useEffect, useRef } from "react";
import { Application, Container, Sprite, Text, Texture } from "pixi.js";

export const PixiExample3 = () => {
  const ctx = useRef<HTMLDivElement | null>(null);

  async function init() {
    const app = new Application();

    globalThis.__PIXI_APP__ = app;

    await app.init({
      background: "#fff",
      width: 640,
      height: 360,
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

      // Label showing scene graph hierarchy
      const label = new Text({
        text: "Scene Graph:\n\napp.stage\n  ┗ A\n     ┗ B\n     ┗ C\n  ┗ D",
        style: { fill: "#000000" }, // 适应白色背景
        position: { x: 300, y: 100 },
      });
      app.stage.addChild(label);

      // 存储字母的容器
      const letters: Container[] = [];

      function addLetter(
        letter: string,
        parent: Container,
        color: number,
        pos: { x: number; y: number }
      ) {
        const bg = new Sprite(Texture.WHITE);
        bg.width = 100;
        bg.height = 100;
        bg.tint = color;

        const text = new Text({
          text: letter,
          style: { fill: "#ffffff" },
        });

        text.anchor.set(0.5);
        text.position.set(50, 50);

        const container = new Container();
        container.position.set(pos.x, pos.y);
        container.visible = false;
        container.addChild(bg, text);
        parent.addChild(container);

        letters.push(container);
        return container;
      }

      // 创建层级结构
      let a = addLetter("A", app.stage, 0xff0000, { x: 100, y: 100 });
      let b = addLetter("B", a, 0x00ff00, { x: 20, y: 20 });
      let c = addLetter("C", a, 0x0000ff, { x: 20, y: 40 });
      let d = addLetter("D", app.stage, 0xff8800, { x: 140, y: 100 });

      let elapsed = 0.0;
      app.ticker.add((ticker) => {
        elapsed += ticker.deltaTime / 60.0;
        if (elapsed >= letters.length) {
          elapsed = 0.0;
        }
        for (let i = 0; i < letters.length; i++) {
          letters[i].visible = elapsed >= i;
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
        height: "500px",
        width: "100%",
      }}
    >
      <div ref={ctx}></div>
    </div>
  );
};
