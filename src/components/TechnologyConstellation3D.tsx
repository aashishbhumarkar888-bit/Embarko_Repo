import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface TechnologyConstellation3DProps {
  selectedSkillName: string | null;
  animationsDisabled: boolean;
  onSelectSkill: (skill: { name: string; level: number; description: string; categoryTitle: string }) => void;
}

export default function TechnologyConstellation3D({
  selectedSkillName,
  animationsDisabled,
  onSelectSkill
}: TechnologyConstellation3DProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [webglSupported, setWebGLSupported] = useState(true);

  // Sync active selection to refs
  const selectedSkillNameRef = useRef(selectedSkillName);
  useEffect(() => {
    selectedSkillNameRef.current = selectedSkillName;
  }, [selectedSkillName]);

  // Primary list of technologies we'll map in our beautiful 3D ecosystem
  const skillsList = [
    { name: "React.js", level: 92, categoryTitle: "Frontend Technologies", description: "Responsive component lifecycles, state systems & client views.", color: 0x3b82f6 },
    { name: "C++", level: 90, categoryTitle: "Programming Languages", description: "Advanced competitive programming & data structures.", color: 0x60a5fa },
    { name: "Node.js", level: 85, categoryTitle: "Backend & Cloud Infrastructure", description: "Performance-oriented asynchronous server systems.", color: 0xf97316 },
    { name: "Firebase", level: 84, categoryTitle: "Database Systems", description: "Firestore persistent schemas & live real-time query syncing.", color: 0xfbae3c },
    { name: "SQL", level: 82, categoryTitle: "Database Systems", description: "Relational queries, indexers, structured storage & tables.", color: 0xf59e0b },
    { name: "Java", level: 85, categoryTitle: "Programming Languages", description: "Object Oriented Programming conceptual design.", color: 0x3b82f6 },
    { name: "Python", level: 80, categoryTitle: "Programming Languages", description: "Scripting, rapid prototyping & intelligent APIs.", color: 0x10b981 },
    { name: "Tailwind CSS", level: 94, categoryTitle: "Frontend Technologies", description: "Utility-first rapid prototyping & beautiful customized stylings.", color: 0x14b8a6 }
  ];

  useEffect(() => {
    if (animationsDisabled) return;
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 350;

    // 1. Scene
    const scene = new THREE.Scene();

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.z = 4.8;

    // 3. Renderer
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);
    } catch (err) {
      console.warn("WebGL not supported for Technology Constellation.");
      setWebGLSupported(false);
      return;
    }

    // 4. Generate Connected 3D Node Mesh Objects
    const nodesGroup = new THREE.Group();
    const nodeGeometry = new THREE.SphereGeometry(0.14, 16, 16);
    const meshes: THREE.Mesh[] = [];

    // Distribute skills evenly on a spherical orbital coordinate space
    skillsList.forEach((sk, i) => {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const radius = 1.8; // orbital distance from center

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      const nodeMat = new THREE.MeshPhongMaterial({
        color: sk.color,
        emissive: sk.color,
        emissiveIntensity: 0.15,
        shininess: 80
      });

      const mesh = new THREE.Mesh(nodeGeometry, nodeMat);
      mesh.position.set(x, y, z);
      mesh.name = sk.name;
      mesh.userData = sk; // bind original meta representation

      nodesGroup.add(mesh);
      meshes.push(mesh);
    });

    scene.add(nodesGroup);

    // Create interconnected bridge lines representing node-to-node pathways
    const linePositions: number[] = [];
    // Fully connected mesh lines joining adjacent coordinates
    for (let i = 0; i < meshes.length; i++) {
      for (let j = i + 1; j < meshes.length; j++) {
        const dist = meshes[i].position.distanceTo(meshes[j].position);
        if (dist < 3.2) { // connect nodes closer than threshold
          linePositions.push(
            meshes[i].position.x, meshes[i].position.y, meshes[i].position.z,
            meshes[j].position.x, meshes[j].position.y, meshes[j].position.z
          );
        }
      }
    }

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x4f4f4f,
      transparent: true,
      opacity: 0.22,
      linewidth: 1
    });
    const constellationLines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(constellationLines);

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1.5, 20);
    pointLight.position.set(2, 4, 3);
    scene.add(pointLight);

    // 6. Raycast Interactivity Handler
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleCanvasClick = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      mouse.x = (x / width) * 2 - 1;
      mouse.y = -(y / height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(meshes);

      if (intersects.length > 0) {
        const clickedMesh = intersects[0].object as THREE.Mesh;
        const clickedData = clickedMesh.userData as typeof skillsList[0];
        if (clickedData) {
          onSelectSkill(clickedData);
        }
      }
    };

    container.addEventListener("click", handleCanvasClick);

    // 7. Handle Resizing
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
      const elapsed = clock.getElapsedTime();

      // Constellation spins slowly
      nodesGroup.rotation.y = elapsed * 0.12;
      nodesGroup.rotation.x = elapsed * 0.05;
      constellationLines.rotation.y = elapsed * 0.12;
      constellationLines.rotation.x = elapsed * 0.05;

      // Pulse the active selected skill node!
      meshes.forEach((mesh) => {
        const isSelected = mesh.name === selectedSkillNameRef.current;
        const scaleVal = isSelected ? 1.6 + Math.sin(elapsed * 6.0) * 0.2 : 1.0;
        mesh.scale.set(scaleVal, scaleVal, scaleVal);

        const mat = mesh.material as THREE.MeshPhongMaterial;
        mat.emissiveIntensity = isSelected ? 0.9 : 0.15;
      });

      renderer.render(scene, camera);
      renderer.domElement.id = "threejs-constellation-nodes-canvas";
    };

    renderer.setAnimationLoop(animate);

    // 9. Memory Cleanup
    return () => {
      container.removeEventListener("click", handleCanvasClick);
      resizeObserver.disconnect();
      renderer.setAnimationLoop(null);

      nodeGeometry.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      meshes.forEach((m) => {
        const meshMat = m.material as THREE.MeshPhongMaterial;
        meshMat.dispose();
      });

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [animationsDisabled, onSelectSkill]);

  if (animationsDisabled || !webglSupported) {
    // Elegant fallback grid lists
    return (
      <div 
        id="constellation-static-elements"
        className="grid grid-cols-2 gap-2 p-4 bg-zinc-950/20 border border-white/5 rounded-2xl"
      >
        {skillsList.map((sk) => (
          <button
            key={sk.name}
            type="button"
            onClick={() => onSelectSkill(sk)}
            className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
              selectedSkillName === sk.name 
                ? "border-orange-500 bg-orange-950/10 text-white font-bold" 
                : "border-white/5 text-zinc-400 hover:border-white/10"
            }`}
          >
            📊 {sk.name} ({sk.level}%)
          </button>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      id="threejs-constellation-canvas-container"
      className="w-full h-[350px] relative rounded-3xl bg-black/40 border border-white/5 flex items-center justify-center cursor-pointer filter drop-shadow-[0_0_20px_rgba(59,130,246,0.1)]"
    />
  );
}
