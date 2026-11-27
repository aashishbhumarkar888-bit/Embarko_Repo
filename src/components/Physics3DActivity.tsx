import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Zap, Activity, AlertCircle, Sparkles, Move } from "lucide-react";

interface Physics3DActivityProps {
  animationsDisabled: boolean;
}

export default function Physics3DActivity({ animationsDisabled }: Physics3DActivityProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [physicsEnabled, setPhysicsEnabled] = useState(true);
  const [lastInteracted, setLastInteracted] = useState<string>("Stable Orbit");
  const [webglSupported, setWebGLSupported] = useState(true);

  useEffect(() => {
    if (animationsDisabled) return;
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 300;

    // 1. Setup ThreeJS Scene
    const scene = new THREE.Scene();

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.z = 5;

    // 3. WebGL Renderer
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);
    } catch (err) {
      console.warn("WebGL not initialized for Physics space.");
      setWebGLSupported(false);
      return;
    }

    // 4. Create Interactive Domain Node Bodies with custom physics metadata
    const nodesGroup = new THREE.Group();
    scene.add(nodesGroup);

    interface PhysicalNode {
      mesh: THREE.Mesh;
      velocity: THREE.Vector3;
      originalPos: THREE.Vector3;
      radius: number;
      color: number;
      mass: number;
    }

    const nodeGeometry = new THREE.SphereGeometry(0.16, 16, 16);
    const physicalNodes: PhysicalNode[] = [];

    // Colors mapping to different developer skills: Lightning orange, Fire red, Wind aqua, Earth gold
    const colors = [0xf97316, 0xef4444, 0x06b6d4, 0xf59e0b, 0x3b82f6, 0x10b981];

    const elementNames = ["VoltPath AI Core", "DSPACE Wind Parser", "Grave-Vault Lock", "B Bansal Matrix", "Reactor Core Energy", "Meteor Node"];

    // Populate physical nodes
    for (let i = 0; i < 8; i++) {
      const radius = 1.3 + Math.random() * 0.8;
      const angle = (i / 8) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const z = (Math.random() - 0.5) * 0.5;

      const color = colors[i % colors.length];
      const mat = new THREE.MeshPhongMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.2,
        shininess: 100,
      });

      const mesh = new THREE.Mesh(nodeGeometry, mat);
      mesh.position.set(x, y, z);
      mesh.name = elementNames[i % elementNames.length];
      nodesGroup.add(mesh);

      physicalNodes.push({
        mesh: mesh,
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.8,
          (Math.random() - 0.5) * 0.8,
          (Math.random() - 0.5) * 0.3
        ),
        originalPos: new THREE.Vector3(x, y, z),
        radius: 0.16,
        color: color,
        mass: 1.0 + Math.random() * 0.5,
      });
    }

    // Centered stable massive standard star "Sun"
    const coreMat = new THREE.MeshPhongMaterial({
      color: 0xff4d00,
      emissive: 0xff3700,
      emissiveIntensity: 0.8,
      shininess: 120,
    });
    const coreMesh = new THREE.Mesh(new THREE.SphereGeometry(0.3, 24, 24), coreMat);
    coreMesh.position.set(0, 0, 0);
    nodesGroup.add(coreMesh);

    // Create elastic bridge lines connecting elements (Spring joints)
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x444444,
      transparent: true,
      opacity: 0.3,
    });
    const lineGeometry = new THREE.BufferGeometry();
    const dynamicLines = new THREE.LineSegments(lineGeometry, lineMat);
    scene.add(dynamicLines);

    // Setup lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1.8, 15);
    pointLight.position.set(2, 3, 4);
    scene.add(pointLight);

    // 5. Interactive Mouse cursor positioning
    const mouse = new THREE.Vector3(-1000, -1000, 0);
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const raycaster = new THREE.Raycaster();
    const mouse2D = new THREE.Vector2();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      mouse2D.x = (x / rect.width) * 2 - 1;
      mouse2D.y = -(y / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse2D, camera);
      const intersectionPoint = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, intersectionPoint);
      mouse.copy(intersectionPoint);
    };

    container.addEventListener("mousemove", handleMouseMove);

    // Dynamic explosion/shockwave on click
    const handleCanvasClick = (e: MouseEvent) => {
      if (!physicsEnabled) return;
      setLastInteracted("System Pulse Shockwave!");

      physicalNodes.forEach((node) => {
        const dX = node.mesh.position.x - mouse.x;
        const dY = node.mesh.position.y - mouse.y;
        const dist = Math.sqrt(dX * dX + dY * dY);

        if (dist < 2.0 && dist > 0.05) {
          const force = (2.0 - dist) * 2.8; // explosive repulsion
          node.velocity.x += (dX / dist) * force;
          node.velocity.y += (dY / dist) * force;
        }
      });
    };

    container.addEventListener("click", handleCanvasClick);

    // 6. Handle resizing cleanly
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

    // 7. Core Physics and Animation Loop
    const clock = new THREE.Clock();
    const boundaries = { x: 2.2, y: 1.5 };

    const animate = () => {
      const delta = Math.min(clock.getDelta(), 0.03); // Cap step size to avoid spikes
      const elapsed = clock.getElapsedTime();

      // Rotate whole nodes group slowly
      if (!physicsEnabled) {
        nodesGroup.rotation.z = elapsed * 0.2;
      } else {
        nodesGroup.rotation.z *= 0.95; // damp orbital spin
      }

      // Visual feedback on mouse hover
      if (Math.abs(mouse.x) < 3 && Math.abs(mouse.y) < 3) {
        coreMesh.position.x = mouse.x * 0.15;
        coreMesh.position.y = mouse.y * 0.15;
      } else {
        coreMesh.position.set(0, 0, 0);
      }

      // Dynamic physics calculations
      physicalNodes.forEach((node, i) => {
        if (!physicsEnabled) {
          // OFF MODE: Static slow circular precession
          const basePos = node.originalPos;
          const orbitAngle = elapsed * 0.4 + i * 0.5;
          node.mesh.position.x = Math.cos(orbitAngle) * basePos.length();
          node.mesh.position.y = Math.sin(orbitAngle) * basePos.length();
          node.mesh.position.z = Math.sin(orbitAngle * 0.5) * 0.1 * basePos.length();
          node.velocity.set(0, 0, 0);

          let scaleVal = 1.0 + Math.sin(elapsed * 4 + i) * 0.08;
          node.mesh.scale.set(scaleVal, scaleVal, scaleVal);
        } else {
          // ON MODE: FULL ACTIVE REAL 3D VECTOR PHYSICS
          // Apply cursor gravity attraction
          if (Math.abs(mouse.x) < 3 && Math.abs(mouse.y) < 3) {
            const dX = mouse.x - node.mesh.position.x;
            const dY = mouse.y - node.mesh.position.y;
            const dist = Math.sqrt(dX * dX + dY * dY);

            if (dist < 3.0 && dist > 0.05) {
              // Gravitational strong pull toward mouse
              const strength = 1.6 / (dist + 0.3);
              node.velocity.x += (dX / dist) * strength * delta;
              node.velocity.y += (dY / dist) * strength * delta;
            }
          }

          // Centered gravitational stable spring orbit
          const toCenter = new THREE.Vector3(0, 0, 0).sub(node.mesh.position);
          const cDist = toCenter.length();
          if (cDist > 0.05) {
            // spring gravity to keep bounds
            const k = 0.4; // spring stiffness
            node.velocity.addScaledVector(toCenter.normalize(), k * cDist * delta);
          }

          // Node-to-Node collisions/interplanetary repulsion to prevent overlap
          for (let j = i + 1; j < physicalNodes.length; j++) {
            const other = physicalNodes[j];
            const diff = node.mesh.position.clone().sub(other.mesh.position);
            const dist = diff.length();
            const minDist = node.radius + other.radius + 0.1;

            if (dist < minDist && dist > 0.02) {
              const overlap = minDist - dist;
              const pushForce = diff.normalize().multiplyScalar(overlap * 3.5);
              node.velocity.addScaledVector(pushForce, delta);
              other.velocity.addScaledVector(pushForce.negate(), delta);
            }
          }

          // Apply friction damping (air resistance)
          node.velocity.multiplyScalar(0.975);

          // Update position
          node.mesh.position.addScaledVector(node.velocity, delta);

          // Render physical boundary elastic collision rebounds
          if (Math.abs(node.mesh.position.x) > boundaries.x) {
            node.mesh.position.x = Math.sign(node.mesh.position.x) * boundaries.x;
            node.velocity.x *= -0.75; // dynamic spring rebound
          }
          if (Math.abs(node.mesh.position.y) > boundaries.y) {
            node.mesh.position.y = Math.sign(node.mesh.position.y) * boundaries.y;
            node.velocity.y *= -0.75;
          }

          // Animate pulsing scale based on velocity activity
          const velActivity = node.velocity.length();
          const targetScale = 1.0 + Math.min(velActivity * 0.25, 0.6);
          node.mesh.scale.set(targetScale, targetScale, targetScale);
        }
      });

      // Update line connections geometrically
      const linePositions: number[] = [];
      for (let i = 0; i < physicalNodes.length; i++) {
        const nodeA = physicalNodes[i];
        
        // Dynamic springs connecting nodes
        for (let j = i + 1; j < physicalNodes.length; j++) {
          const nodeB = physicalNodes[j];
          const dist = nodeA.mesh.position.distanceTo(nodeB.mesh.position);

          if (dist < (physicsEnabled ? 2.5 : 1.8)) {
            linePositions.push(
              nodeA.mesh.position.x, nodeA.mesh.position.y, nodeA.mesh.position.z,
              nodeB.mesh.position.x, nodeB.mesh.position.y, nodeB.mesh.position.z
            );
          }
        }

        // Draw connections to center core
        const coreDist = nodeA.mesh.position.distanceTo(coreMesh.position);
        if (coreDist < 3.0) {
          linePositions.push(
            nodeA.mesh.position.x, nodeA.mesh.position.y, nodeA.mesh.position.z,
            coreMesh.position.x, coreMesh.position.y, coreMesh.position.z
          );
        }
      }

      lineGeometry.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
      lineGeometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    renderer.setAnimationLoop(animate);

    // 8. Cleanup memory on unmount
    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("click", handleCanvasClick);
      resizeObserver.disconnect();
      renderer.setAnimationLoop(null);

      nodeGeometry.dispose();
      lineGeometry.dispose();
      lineMat.dispose();
      coreMat.dispose();

      physicalNodes.forEach((node) => {
        const mat = node.mesh.material as THREE.MeshPhongMaterial;
        mat.dispose();
      });

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [animationsDisabled, physicsEnabled]);

  return (
    <div className="bg-[#050508] border border-orange-500/10 rounded-2xl p-4 w-full text-xs font-mono text-orange-200 shadow-xl overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(249,115,22,0.02),transparent)]" />
      
      <div className="flex items-center justify-between border-b border-orange-500/10 pb-2 mb-3 relative z-10">
        <span className="text-[10px] font-bold uppercase text-orange-400 tracking-wider flex items-center gap-1.5 font-space">
          <Activity className={`w-3.5 h-3.5 text-orange-500 ${physicsEnabled ? "animate-pulse" : ""}`} /> 
          3D Activity Space
        </span>
        
        {/* Toggle buttons */}
        <button
          type="button"
          onClick={() => {
            setPhysicsEnabled(!physicsEnabled);
            setLastInteracted(`Toggled Physics Mode: ${!physicsEnabled ? "ON" : "OFF"}`);
          }}
          className={`px-2.5 py-0.5 rounded text-[9px] font-mono tracking-widest uppercase border transition-all cursor-pointer ${
            physicsEnabled 
              ? "bg-orange-500/15 border-orange-500 text-orange-400 font-extrabold shadow-[0_0_8px_rgba(249,115,22,0.2)]" 
              : "bg-zinc-950/80 border-white/5 text-zinc-400 hover:border-zinc-750"
          }`}
        >
          {physicsEnabled ? "💡 Physics: ON" : "💤 Physics: OFF"}
        </button>
      </div>

      {animationsDisabled || !webglSupported ? (
        <div id="physics-modes-fallback" className="py-12 text-center text-zinc-500 flex flex-col items-center justify-center border border-dashed border-white/5 rounded-xl">
          <AlertCircle className="w-8 h-8 text-zinc-600 mb-2 animate-bounce" />
          <p className="text-[10px] uppercase tracking-wider">3D Animations Disabled via Settings</p>
          <span className="text-[8px] text-zinc-650 font-mono">Use "3D Active" toggler at header deck</span>
        </div>
      ) : (
        <>
          {/* Centered Canvas Container */}
          <div
            ref={containerRef}
            id="physics-threejs-canvas-viewport"
            className="w-full h-[220px] rounded-xl bg-black/45 relative cursor-crosshair overflow-hidden border border-white/5"
          />

          {/* Quick HUD telemetry deck */}
          <div className="flex justify-between items-center text-[9px] text-[#A1A1AA] mt-2 bg-zinc-950/50 p-2 rounded-lg border border-white/5 relative z-10 font-mono">
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-orange-400" />
              EVENT: <span className="text-zinc-200 uppercase">{lastInteracted}</span>
            </span>
            <span className="text-right text-[8px] tracking-widest text-[#71717A]">
              {physicsEnabled ? "PULL VECTORS ENABLED // HOVER CANVAS" : "SLOW ELLIPSE PRECESSION"}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
