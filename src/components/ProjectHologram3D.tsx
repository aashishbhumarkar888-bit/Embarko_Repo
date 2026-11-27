import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface ProjectHologram3DProps {
  projectId: string;
  colorHex: string;
  animationsDisabled: boolean;
  onCardClick: () => void;
}

export default function ProjectHologram3D({ 
  projectId, 
  colorHex, 
  animationsDisabled,
  onCardClick 
}: ProjectHologram3DProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [webglSupported, setWebglSupported] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const isHoveredRef = useRef(false);

  useEffect(() => {
    isHoveredRef.current = isHovered;
  }, [isHovered]);

  useEffect(() => {
    if (animationsDisabled) return;
    const container = containerRef.current;
    if (!container) return;

    // Dimensions setup
    const width = container.clientWidth || 220;
    const height = container.clientHeight || 180;

    // 1. Scene
    const scene = new THREE.Scene();

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.z = 4.2;

    // 3. Renderer
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);
    } catch (e) {
      console.warn("WebGL blocked. Project Hologram fallback requested.");
      setWebglSupported(false);
      return;
    }

    // 4. Mesh Creation
    // Standard Card geometry (Plane or flattened box)
    const cardGeometry = new THREE.BoxGeometry(2.1, 1.4, 0.08);
    
    // Wireframe helper for cool futuristic digital lines
    const edges = new THREE.EdgesGeometry(cardGeometry);
    const lineMaterial = new THREE.LineBasicMaterial({ 
      color: new THREE.Color(colorHex),
      linewidth: 3 
    });
    const hologramLines = new THREE.LineSegments(edges, lineMaterial);
    scene.add(hologramLines);

    // Dynamic inner data grids inside the holographic card
    const innerGeometry = new THREE.PlaneGeometry(1.9, 1.2);
    const innerMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(colorHex),
      wireframe: true,
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide
    });
    const innerGrid = new THREE.Mesh(innerGeometry, innerMaterial);
    innerGrid.position.z = 0.01;
    scene.add(innerGrid);

    // Decorative floating core anchor sphere
    const sphereGeometry = new THREE.SphereGeometry(0.2, 8, 8);
    const sphereMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.6
    });
    const coreSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(coreSphere);

    // 5. Ambient lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);

    const point = new THREE.PointLight(new THREE.Color(colorHex), 1.8, 15);
    point.position.set(2, 2, 2);
    scene.add(point);

    // 6. Handle resizing
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

    // 7. Render Loop
    const clock = new THREE.Clock();

    const animate = () => {
      const time = clock.getElapsedTime();

      // Slow rotation ONLY when not hovered
      if (!isHoveredRef.current) {
        hologramLines.rotation.y = time * 0.45;
        innerGrid.rotation.y = time * 0.45;
        coreSphere.rotation.y = -time * 0.8;
      }

      // Vertical organic floating oscillation (always active for physical simulation)
      const floatVal = Math.sin(time * 1.5) * 0.14;
      hologramLines.position.y = floatVal;
      innerGrid.position.y = floatVal;
      coreSphere.position.y = floatVal;

      renderer.render(scene, camera);
      renderer.domElement.id = `threejs-project-hologram-${projectId}`;
    };

    renderer.setAnimationLoop(animate);

    // 8. Clean memory properly
    return () => {
      resizeObserver.disconnect();
      renderer.setAnimationLoop(null);
      
      cardGeometry.dispose();
      edges.dispose();
      lineMaterial.dispose();
      innerGeometry.dispose();
      innerMaterial.dispose();
      sphereGeometry.dispose();
      sphereMaterial.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [projectId, colorHex, animationsDisabled]);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  if (animationsDisabled || !webglSupported) {
    // Elegant static visual layout if disabled
    return (
      <button
        onClick={onCardClick}
        id={`hologram-static-${projectId}`}
        className="w-full h-full min-h-[160px] cursor-pointer flex flex-col items-center justify-center border border-white/5 bg-zinc-950/40 rounded-2xl hover:border-orange-500/30 transition-all text-center relative p-4 group"
      >
        <span 
          className="absolute inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ background: `radial-gradient(circle at center, ${colorHex}10, transparent)` }}
        />
        <span className="text-xl">🎴</span>
        <h4 className="text-white font-space font-extrabold text-xs mt-2 uppercase tracking-wide">Static Hologram Card</h4>
        <p className="text-zinc-500 font-mono text-[8px] tracking-wider uppercase mt-1">Tap To Preview Blueprint</p>
      </button>
    );
  }

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onCardClick}
      id={`hologram-canvas-card-${projectId}`}
      className="w-full h-full min-h-[160px] flex items-center justify-center relative cursor-pointer filter drop-shadow-[0_0_20px_rgba(0,0,0,0.5)] border border-white/5 bg-black/10 rounded-2xl hover:border-white/15 transition-all"
    />
  );
}
