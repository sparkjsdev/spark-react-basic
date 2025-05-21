import { ForgeControls, SplatMesh } from "@worldlabsai/forge";
import { useCallback, useRef } from "react";
import Stats from "stats.js";
import * as THREE from "three";

function App() {
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<ForgeControls | null>(null);
  const statsRef = useRef<Stats | null>(null);
  const resizeHandlerRef = useRef<(() => void) | null>(null);

  const initCanvas = useCallback((canvas: HTMLCanvasElement) => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      1000,
    );
    camera.position.z = 2;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    rendererRef.current = renderer;

    // ForgeControls for FPS-style navigation.
    const controls = new ForgeControls({ canvas });
    controlsRef.current = controls;

    // FPS stats overlay.
    const stats = new Stats();
    stats.showPanel(0); // 0: fps
    document.body.appendChild(stats.dom);
    statsRef.current = stats;

    // Add a simple splat mesh similar to the vanilla example.
    const butterfly = new SplatMesh({ url: "/assets/splats/butterfly.wlg" });
    butterfly.quaternion.set(1, 0, 0, 0);
    butterfly.position.set(0, 0, -1);
    scene.add(butterfly);

    // Handle resizing – store handler so we can remove it later.
    const onResize = () => {
      if (!canvas) return;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    };
    window.addEventListener("resize", onResize);
    resizeHandlerRef.current = onResize;

    // Animation loop.
    renderer.setAnimationLoop(() => {
      stats.begin();
      controls.update(camera);
      butterfly.rotation.y += 0.01;
      renderer.render(scene, camera);
      stats.end();
    });

    return () => {
      rendererRef.current?.setAnimationLoop(null);
      rendererRef.current?.dispose();
      if (controlsRef.current) {
        controlsRef.current = null;
      }
      if (statsRef.current) {
        document.body.removeChild(statsRef.current.dom);
        statsRef.current = null;
      }
      if (resizeHandlerRef.current) {
        window.removeEventListener("resize", resizeHandlerRef.current);
      }
    };
  }, []);

  return (
    <div className="flex h-screen w-screen">
      <canvas ref={initCanvas} id="forge-canvas" className="size-full" />
    </div>
  );
}

export default App;
