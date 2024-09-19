import React, { useRef, useEffect } from "react";
import * as THREE from "three";

const ThreeDVisualization = ({ gridSize, weatherData, paths }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    // Set up the scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Add a grid to the scene
    const gridGeometry = new THREE.PlaneGeometry(
      gridSize,
      gridSize,
      gridSize,
      gridSize
    );
    const gridMaterial = new THREE.MeshBasicMaterial({
      color: 0x87ceeb,
      side: THREE.DoubleSide,
      wireframe: true,
    });
    const grid = new THREE.Mesh(gridGeometry, gridMaterial);
    grid.rotation.x = Math.PI / 2;
    scene.add(grid);

    // Add a light
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1).normalize();
    scene.add(light);

    // Add terrain heights
    const heightMap = new Float32Array(gridSize * gridSize);
    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        const key = `${x},${y}`;
        const height = weatherData[key]?.waveHeight || 0;
        heightMap[x * gridSize + y] = height;
      }
    }
    gridGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(heightMap, 1)
    );

    // Draw paths
    const pathMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
    paths.forEach((path) => {
      const pathGeometry = new THREE.Geometry();
      path.forEach((position) => {
        const [x, y] = position.split(",").map(Number);
        pathGeometry.vertices.push(
          new THREE.Vector3(x, weatherData[`${x},${y}`]?.waveHeight || 0, y)
        );
      });
      const pathLine = new THREE.Line(pathGeometry, pathMaterial);
      scene.add(pathLine);
    });

    // Set the camera position
    camera.position.z = gridSize * 2;
    camera.position.y = gridSize / 2;
    camera.lookAt(new THREE.Vector3(gridSize / 2, 0, gridSize / 2));

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    return () => {
      mountRef.current.removeChild(renderer.domElement);
    };
  }, [gridSize, weatherData, paths]);

  return <div ref={mountRef} style={{ width: "100vw", height: "100vh" }} />;
};

export default ThreeDVisualization;
