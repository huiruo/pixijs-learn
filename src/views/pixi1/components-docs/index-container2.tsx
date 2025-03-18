import { useEffect, useRef } from "react";
import { Application, Graphics, Container, Text, TextStyle, Assets, Sprite } from "pixi.js";

export const Container2 = () => {
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
      // const text = new Text({ text: "test", style: textStyle });
      // Create contents for the masked container
      const text = new Text({
        text: 'This text will scroll up and be masked, so you can see how masking works.\n\n' +
          'You can put anything in the container and it will be masked!',
        style: {
          fontSize: 24,
          fill: 0x1010ff,
          wordWrap: true,
          wordWrapWidth: 180,
        },
      });

      text.anchor.set(0.5);
      text.x = app.screen.width / 2;
      text.y = app.screen.height / 2;
      app.stage.addChild(text);




      // Create window frame
      const frame = new Graphics()
        .rect(0, 0, 208, 208)
        .fill(0x666666)
        .stroke({ color: 0xffffff, width: 4, alignment: 0 });
      frame.position.set(320 - 104, 180 - 104);
      app.stage.addChild(frame);

      // Create a graphics object to define our mask
      const mask = new Graphics().rect(0, 0, 200, 200).fill(0xffffff);

      // Add container that will hold our masked content
      const maskContainer = new Container();
      maskContainer.mask = mask;
      maskContainer.addChild(mask);
      maskContainer.position.set(4, 4);
      frame.addChild(maskContainer);

      text.position.set(10, 0);
      maskContainer.addChild(text);

      let elapsed = 0.0;
      app.ticker.add((ticker) => {
        elapsed += ticker.deltaTime;
        text.y = 10 + -100.0 + Math.cos(elapsed / 50.0) * 100.0;
      });




      // 功能3：让 Bunny 旋转:Listen for animate update
      app.ticker.add((ticker) => {
        // if (bunny) {
        //   // 在 PixiJS v8 中，delta 传入的参数是 Ticker 本身，而不是之前的 number 类型的 deltaTime。
        //   // bunny.rotation += 0.1 * ticker.deltaTime;
        //   bunny.rotation += 0.02 * ticker.deltaTime; // 速度变慢
        // }
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
