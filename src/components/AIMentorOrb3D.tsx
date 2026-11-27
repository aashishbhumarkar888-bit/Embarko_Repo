import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface AIMentorOrb3DProps {
  animationsDisabled: boolean;
}

export default function AIMentorOrb3D({ animationsDisabled }: AIMentorOrb3DProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    if (animationsDisabled) return;
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene setup
    const scene = new THREE.Scene();

    // 2. Camera setup
    const width = container.clientWidth || 300;
    const height = container.clientHeight || 300;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 5;

    // 3. Renderer Setup
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);
    } catch (e) {
      console.warn("WebGL not supported by environment. Falling back to CSS mesh.");
      setWebglSupported(false);
      return;
    }

    // 4. Geometry and materials
    const geometry = new THREE.SphereGeometry(1.4, 32, 32);
    
    // Core glowing material with wireframes or custom colors
    const material = new THREE.MeshPhongMaterial({
      color: 0xf97316, // premium orange
      wireframe: true,
      transparent: true,
      opacity: 0.45,
      shininess: 100,
      specular: 0xffffff
    });
    
    const coreMesh = new THREE.Mesh(geometry, material);
    scene.add(coreMesh);

    // Dynamic shell: nested wireframe for rich interference pattern
    const outerGeometry = new THREE.IcosahedronGeometry(1.8, 2);
    const outerMaterial = new THREE.MeshBasicMaterial({
      color: 0xa855f7, // royal lavender purple for dual core contrast
      wireframe: true,
      transparent: true,
      opacity: 0.25
    });
    const outerMesh = new THREE.Mesh(outerGeometry, outerMaterial);
    scene.add(outerMesh);

    // Floating halo particles
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 60;
    const posArray = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 5;
    }

    particleGeometry.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.04,
      color: 0xfb923c,
      transparent: true,
      opacity: 0.8
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // 5. Lights setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1.5, 30);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0xf97316, 2, 20);
    pointLight2.position.set(-5, -5, -3);
    scene.add(pointLight2);

    // 6. Handle cursor interaction
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const rawX = event.clientX - rect.left;
      const rawY = event.clientY - rect.top;
      
      // Normalized device coordinates
      mouse.targetX = (rawX / width) * 2 - 1;
      mouse.targetY = -(rawY / height) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // 7. Handle resized viewport safely
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width || container.clientWidth;
        const h = entry.contentRect.height || container.clientHeight;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      }
    });
    resizeObserver.observe(container);

    // 8. Render loop
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Smoothly interpolate current position towards mouse position
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      // Reactively lean / rotate meshes based on cursor movement
      coreMesh.rotation.y = elapsedTime * 0.25 + mouse.x * 1.5;
      coreMesh.rotation.x = elapsedTime * 0.15 + mouse.y * 1.5;

      outerMesh.rotation.y = -elapsedTime * 0.15 + mouse.x * 0.8;
      outerMesh.rotation.z = elapsedTime * 0.1 - mouse.y * 0.8;

      // Micro floating state
      coreMesh.position.y = Math.sin(elapsedTime * 1.2) * 0.12;
      outerMesh.position.y = Math.sin(elapsedTime * 1.2) * 0.12;

      // Gently swirl particles
      particles.rotation.y = elapsedTime * 0.05;

      renderer.render(scene, camera);
      renderer.domElement.id = "threejs-mentor-orb-element";
    };

    renderer.setAnimationLoop(animate);

    // 9. CLEANUP MEMORY EXPLICITLY (Crucial rule for Zero leaks)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      resizeObserver.disconnect();
      renderer.setAnimationLoop(null);
      
      // Dispose materials & geometries
      geometry.dispose();
      material.dispose();
      outerGeometry.dispose();
      outerMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [animationsDisabled]);

  if (animationsDisabled || !webglSupported) {
    // Beautiful pure CSS styling fallback image if animation is disabled or WebGL is missing
    return (
      <div 
        id="ai-mentor-orb-static-fallback"
        className="w-full h-full min-h-[220px] flex items-center justify-center relative rounded-full"
      >
        <div className="absolute w-32 h-32 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 blur-3xl opacity-30 animate-pulse pointer-events-none" />
        <div className="relative border border-orange-500/20 bg-zinc-950/60 p-5 rounded-full flex flex-col items-center justify-center text-center shadow-[0_0_30px_rgba(249,115,22,0.1)] w-36 h-36 border-dashed">
          <span className="text-xl">🔮</span>
          <span className="text-[9px] font-mono mt-1 uppercase text-orange-400 font-bold">Standard Mentor Orb</span>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={mountRef}
      id="threejs-mentor-orb-container"
      className="w-full h-full min-h-[220px] max-h-[300px] flex items-center justify-center relative cursor-move filter drop-shadow-[0_0_40px_rgba(249,115,22,0.18)]"
    />
  );
}
