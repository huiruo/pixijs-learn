import { useEffect, useRef } from "react";
import { Application, Assets, Container, Sprite, Text, Texture } from "pixi.js";

export const PixiExampleContainer = () => {
  const ctx = useRef<HTMLDivElement | null>(null);

  async function init() {
    const app = new Application({
      background: "#1099bb",
      width: 400,
      height: 400,
    });

    globalThis.__PIXI_APP__ = app;

    await app.init({
      background: "#1099bb",
      resizeTo: window,
    });

    return app;
  }

  useEffect(() => {
    let appInstance: Application | null = null;

    init().then((app) => {
      if (!ctx.current || appInstance) return;
      appInstance = app;

      // Mount the PixiJS canvas to the React component
      ctx.current?.appendChild(app.canvas);

      // Create and add a container to the stage
      const container = new Container();
      app.stage.addChild(container);

      // Load the bunny texture
      Assets.load("https://pixijs.com/assets/bunny.png").then((texture) => {
        // Create a 5x5 grid of bunnies in the container
        for (let i = 0; i < 25; i++) {
          const bunny = new Sprite(texture);
          bunny.x = (i % 5) * 40;
          bunny.y = Math.floor(i / 5) * 40;
          container.addChild(bunny);
        }

        // Move the container to the center
        container.x = app.screen.width / 2;
        container.y = app.screen.height / 2;

        // Center the bunny sprites in local container coordinates
        container.pivot.x = container.width / 2;
        container.pivot.y = container.height / 2;

        // Listen for animate update to rotate the container
        app.ticker.add((time) => {
          container.rotation -= 0.01 * time.deltaTime;
        });
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
      test
      <div ref={ctx}></div>
    </div>
  );
};