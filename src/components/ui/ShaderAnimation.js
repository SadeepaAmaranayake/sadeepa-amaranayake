import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export function ShaderAnimation({
  accent = "#96c702",
  className = "",
  speed = 0.25,
}) {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    if (!("IntersectionObserver" in window)) {
      setIsVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin: "100px 0px", threshold: 0.01 },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isVisible) return undefined;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let animationId = 0;
    let renderer;

    const vertexShader = `
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      precision highp float;

      uniform vec2 resolution;
      uniform float time;
      uniform vec3 accent;

      void main() {
        vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy)
          / min(resolution.x, resolution.y);

        float t = time * 0.05;
        float lineWidth = 0.002;
        float ripple = 0.0;

        for (int j = 0; j < 3; j++) {
          for (int i = 0; i < 5; i++) {
            float pattern = lineWidth * float(i * i)
              / max(
                abs(
                  fract(t - 0.01 * float(j) + float(i) * 0.01) * 5.0
                  - length(uv)
                  + mod(uv.x + uv.y, 0.2)
                ),
                0.0001
              );
            ripple += pattern * (0.18 + float(j) * 0.035);
          }
        }

        float centerGlow = 0.12 / (0.18 + length(uv));
        float edgeFade = 1.0 - smoothstep(0.7, 1.45, length(uv));
        vec3 background = vec3(0.008, 0.018, 0.026);
        vec3 color = background
          + accent * (min(ripple, 1.25) + centerGlow * 0.16) * edgeFade;

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    const camera = new THREE.Camera();
    camera.position.z = 1;

    const scene = new THREE.Scene();
    const geometry = new THREE.PlaneGeometry(2, 2);
    const uniforms = {
      time: { value: 1 },
      resolution: { value: new THREE.Vector2() },
      accent: { value: new THREE.Color(accent) },
    };
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    try {
      renderer = new THREE.WebGLRenderer({ antialias: true });
    } catch {
      geometry.dispose();
      material.dispose();
      return undefined;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.domElement.className = "shader-animation-canvas";
    container.appendChild(renderer.domElement);

    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      renderer.setSize(Math.max(1, width), Math.max(1, height), false);
      uniforms.resolution.value.set(
        renderer.domElement.width,
        renderer.domElement.height,
      );
    };

    const startedAt = performance.now();
    const render = (now) => {
      uniforms.time.value = prefersReducedMotion
        ? 24
        : 1 + ((now - startedAt) / 16.67) * speed;
      renderer.render(scene, camera);

      if (!prefersReducedMotion) {
        animationId = requestAnimationFrame(render);
      }
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();
    render(startedAt);

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      scene.remove(mesh);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, [accent, isVisible, speed]);

  return (
    <div
      ref={containerRef}
      className={`shader-animation ${className}`.trim()}
      aria-hidden="true"
    />
  );
}
