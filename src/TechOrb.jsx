import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function TechOrb() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 450;
    const height = container.clientHeight || 450;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 5.5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Lights - Cool Silver & White Highlights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const silverLight1 = new THREE.PointLight(0xffffff, 2.8, 10);
    silverLight1.position.set(3, 3, 3);
    scene.add(silverLight1);

    const silverLight2 = new THREE.PointLight(0xe2e8f0, 2.2, 10);
    silverLight2.position.set(-3, -3, 2);
    scene.add(silverLight2);

    // 3. Glass Outer Sphere (Completely Transparent)
    const sphereGeo = new THREE.SphereGeometry(1.85, 48, 48);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0,
      wireframe: false
    });
    const glassSphere = new THREE.Mesh(sphereGeo, glassMat);
    scene.add(glassSphere);

    // 4. Outer Wireframe Latitude Ring Sphere - Cool Silver
    const wireGeo = new THREE.SphereGeometry(1.87, 24, 24);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xe2e8f0,
      wireframe: true,
      transparent: true,
      opacity: 0.22
    });
    const wireSphere = new THREE.Mesh(wireGeo, wireMat);
    scene.add(wireSphere);

    // 5. Concentric Angled Orbital Rings - Metallic Chrome / Cool Silver
    const ringGeo1 = new THREE.TorusGeometry(2.02, 0.012, 16, 100);
    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0xcbd5e1, transparent: true, opacity: 0.55 });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    ring1.rotation.y = Math.PI / 6;
    scene.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(2.15, 0.008, 16, 100);
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0x94a3b8, transparent: true, opacity: 0.4 });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.y = Math.PI / 4;
    scene.add(ring2);

    // 6. Glowing Particle Swarm - Silver / Chrome / White Palette
    const particleCount = 100;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorPalette = [
      new THREE.Color(0xffffff),
      new THREE.Color(0xe2e8f0),
      new THREE.Color(0xc0c0c0),
      new THREE.Color(0x94a3b8)
    ];

    for (let i = 0; i < particleCount; i++) {
      const r = 1.4 + Math.random() * 0.48;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      const c = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    const particlesGeo = new THREE.BufferGeometry();
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particlesMat = new THREE.PointsMaterial({
      size: 0.075,
      vertexColors: true,
      transparent: true,
      opacity: 0.88,
      blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particleSystem);

    // 7. Animation Loop - Smooth 3D Rotations
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      glassSphere.rotation.y += 0.003;
      wireSphere.rotation.y -= 0.002;
      wireSphere.rotation.x += 0.001;

      ring1.rotation.z += 0.002;
      ring2.rotation.z -= 0.0015;

      particleSystem.rotation.y += 0.0025;
      particleSystem.rotation.x += 0.001;

      renderer.render(scene, camera);
    };
    animate();

    // 8. Handle Resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      sphereGeo.dispose();
      glassMat.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      ringGeo1.dispose();
      ringMat1.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      particlesGeo.dispose();
      particlesMat.dispose();
    };
  }, []);

  return (
    <div className="tech-orb-wrapper">
      <div ref={mountRef} className="tech-orb-canvas" />

      <div className="tech-orb-center-label magnetic-target">
        <span className="orb-title">TECHNICAL</span>
        <span className="orb-accent">ARSENAL</span>
      </div>
    </div>
  );
}
