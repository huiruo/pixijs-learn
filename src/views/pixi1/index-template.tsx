import { useEffect, useRef } from "react";
import { Application, Renderer, Graphics, Container, Point } from "pixi.js";

export const PixiExample1 = () => {
  const ctx = useRef<HTMLDivElement | null>(null);

  async function init() {
    const app = new Application();
    await app.init({
      background: '#fff',
      width: 400,
      height: 400,
    });
    return Promise.resolve(app);
  }

  useEffect(() => {
    init().then((app) => {
      // 把pixi挂载到页面上
      ctx.current?.appendChild(app.canvas);
    });
  }, [])

  return <div style={{
    background: 'grey',
    height: '500px',
    width: '100%'
  }}>
    test
    <div ref={ctx}></div>
  </div>
}
