import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface AchievementMonument3DProps {
  activeId: string;
  animationsDisabled: boolean;
  onSelectAchievement: (id: string) => void;
}

export default function AchievementMonument3D({
  activeId,
  animationsDisabled,
  onSelectAchievement
}: AchievementMonument3DProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [webglSupported, setWebglSupported] = useState(true);

  // Use refs to communicate selected state immediately into loop without rebuilds
  const activeIdRef = useRef(activeId);
  useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);

  useEffect(() => {
    if (animationsDisabled) return;
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 300;

    // 1. Scene
    const scene = new THREE.Scene();

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.8, 6.2);
    camera.lookAt(0, 0.5, 0);

    // 3. Renderer
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);
    } catch (e) {
      console.warn("WebGL not supported for Achievements Monument. Using falling back.");
      setWebglSupported(false);
      return;
    }

    // 4. Monuments Pillars Creation
    // We create 3 Obelisks (monolithic pillars) representing NASA, Microsoft, National Achievements
    const pillarGeometry = new THREE.CylinderGeometry(0.24, 0.32, 2.0, 4); // 4-sided square pillar
    const pyramidGeometry = new THREE.ConeGeometry(0.32, 0.3, 4); // cone top
    pyramidGeometry.rotateY(Math.PI / 4); // align cone edges

    const materials = {
      nasa: new THREE.MeshPhongMaterial({
        color: 0xf97316, // orange
        wireframe: true,
        transparent: true,
        opacity: 0.8
      }),
      ms: new THREE.MeshPhongMaterial({
        color: 0x10b981, // emerald green
        wireframe: true,
        transparent: true,
        opacity: 0.8
      }),
      national: new THREE.MeshPhongMaterial({
        color: 0xa855f7, // purple
        wireframe: true,
        transparent: true,
        opacity: 0.8
      })
    };

    const pillarsData = [
      { id: "nasa-space-apps", x: -1.8, mat: materials.nasa, name: "NASA" },
      { id: "ms-hackathon", x: 0, mat: materials.ms, name: "Microsoft" },
      { id: "national-hackathon-runnerup", x: 1.8, mat: materials.national, name: "National" }
    ];

    const pillarsGroup = new THREE.Group();
    const pillarMeshes: THREE.Object3D[] = [];

    pillarsData.forEach((data) => {
      const pGroup = new THREE.Group();
      pGroup.position.x = data.x;
      pGroup.name = data.id;

      // Base Pillar Mesh
      const mesh = new THREE.Mesh(pillarGeometry, data.mat);
      mesh.position.y = 1.0;
      pGroup.add(mesh);

      // Top Pyramid Mesh
      const pyrMesh = new THREE.Mesh(pyramidGeometry, data.mat);
      pyrMesh.position.y = 2.15;
      pGroup.add(pyrMesh);

      // Add simple invisible bounding box cylinder for easier hover raycasting
      const touchGeo = new THREE.CylinderGeometry(0.5, 0.5, 2.5, 8);
      const touchMat = new THREE.MeshBasicMaterial({ visible: false });
      const touchMesh = new THREE.Mesh(touchGeo, touchMat);
      touchMesh.position.y = 1.25;
      touchMesh.name = data.id; // very important for raycasting check
      pGroup.add(touchMesh);

      pillarsGroup.add(pGroup);
      pillarMeshes.push(touchMesh);
    });

    scene.add(pillarsGroup);

    // Dynamic ground grid helper
    const gridHelper = new THREE.GridHelper(8, 8, 0x4f4f4f, 0x1a1a1a);
    gridHelper.position.y = -0.1;
    scene.add(gridHelper);

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(2, 6, 4);
    scene.add(dirLight);

    // Spotlights above each pillar to cast an interactive beam of light!
    const spotLights: { [key: string]: THREE.SpotLight } = {};
    pillarsData.forEach((data) => {
      const spot = new THREE.SpotLight(0xffffff, 3.5, 6, Math.PI / 6, 0.5, 1);
      spot.position.set(data.x, 3.0, 0);
      spot.target.position.set(data.x, 0, 0);
      scene.add(spot);
      scene.add(spot.target);
      spotLights[data.id] = spot;
    });

    // 6. Handle Raycaster Interaction (Click on Pillar)
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleCanvasClick = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // Translate coordinates to normalized device coordinates (-1 to +1)
      mouse.x = (x / width) * 2 - 1;
      mouse.y = -(y / height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(pillarMeshes, true);

      if (intersects.length > 0) {
        const clickedMesh = intersects[0].object;
        const targetId = clickedMesh.name;
        if (targetId) {
          onSelectAchievement(targetId);
        }
      }
    };

    container.addEventListener("click", handleCanvasClick);

    // 7. Handle Resize
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
      const time = clock.getElapsedTime();

      // Slow vertical organic floating of the entire group
      pillarsGroup.children.forEach((group, index) => {
        const pId = group.name;
        const isSelected = pId === activeIdRef.current;

        // Individual vertical floating offsets
        const floatShift = Math.sin(time * 1.4 + index * 1.5) * 0.15;
        group.position.y = floatShift;

        // Rotate selected pillar faster to denote active charging state!
        const rotSpeed = isSelected ? 1.4 : 0.25;
        group.children[0].rotation.y = time * rotSpeed; // rotate mesh
        group.children[1].rotation.y = time * rotSpeed; // rotate cone top

        // Set spotlight brightness based on selection!
        if (spotLights[pId]) {
          spotLights[pId].intensity = isSelected ? 6.0 : 1.2;
          spotLights[pId].color.setHex(isSelected ? 0xffffff : 0x4f4f4f);
        }
      });

      renderer.render(scene, camera);
      renderer.domElement.id = "threejs-monument-canvas-element";
    };

    renderer.setAnimationLoop(animate);

    // 9. Cleanup WebGL Memory
    return () => {
      container.removeEventListener("click", handleCanvasClick);
      resizeObserver.disconnect();
      renderer.setAnimationLoop(null);

      pillarGeometry.dispose();
      pyramidGeometry.dispose();
      Object.values(materials).forEach((m) => m.dispose());
      gridHelper.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [animationsDisabled, onSelectAchievement]);

  if (animationsDisabled || !webglSupported) {
    // Beautiful pure CSS fallback widget
    return (
      <div 
        id="achievements-monument-static-pill"
        className="w-full h-[260px] flex items-center justify-around bg-[#050508] border border-white/5 rounded-3xl p-6"
      >
        {["NASA Global Nominee", "Microsoft 3rd Place", "National Runner-up"].map((lbl, i) => (
          <div 
            key={lbl} 
            className={`flex flex-col items-center justify-center p-4 border rounded-xl w-[140px] text-center ${
              activeId === (i === 0 ? "nasa-space-apps" : i === 1 ? "ms-hackathon" : "national-hackathon-runnerup")
                ? "border-orange-500 bg-orange-950/10 text-white"
                : "border-white/5 text-zinc-500"
            }`}
          >
            <span className="text-xl">{i === 0 ? "🌍" : i === 1 ? "🏆" : "🥈"}</span>
            <p className="text-[10px] font-mono mt-2 font-bold uppercase">{lbl}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div 
      ref={mountRef}
      id="threejs-achievement-monument-container"
      className="w-full h-[320px] rounded-3xl bg-black/40 border border-white/5 flex items-center justify-center relative cursor-cell"
    />
  );
}
