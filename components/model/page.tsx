'use client';
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default function GltfViewer({
  gltfUrl = '/santa/scene.gltf',
  width = 400,
  height = 550,
}) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let gltfScene: THREE.Object3D | null = null;
    let mixer: THREE.AnimationMixer | null = null;
    const clock = new THREE.Clock();

    if (!mountRef.current) return;

    mountRef.current.innerHTML = '';

    // Сцена
    const scene = new THREE.Scene();

    // Камера
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 0, 5);

    // Рендерер
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    // Орбитальные контролы
    const controls = new OrbitControls(camera, renderer.domElement);

    // Свет
    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    scene.add(new THREE.DirectionalLight(0xffffff, 0.6));

    // Загрузка glTF
    const loader = new GLTFLoader();
    loader.load(
      gltfUrl,
      (gltf) => {
        gltfScene = gltf.scene;

        gltfScene.rotation.x = THREE.MathUtils.degToRad(20); // 45° вокруг оси X
        gltfScene.rotation.y = THREE.MathUtils.degToRad(240); // 90° вокруг оси Y
        gltfScene.rotation.z = THREE.MathUtils.degToRad(-10); // 0° вокруг оси Z
        scene.add(gltf.scene);

        // --- Работа с анимацией! ---
        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(gltf.scene);
          gltf.animations.forEach((clip) => {
            mixer?.clipAction(clip).play();
          });
        }
      },
      undefined,
      (error) => {
        console.error('Ошибка загрузки glTF:', error);
      }
    );

    // Анимация
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      if (mixer) {
        mixer.update(clock.getDelta());
      }
      renderer.render(scene, camera);
    };
    animate();

    // Очистка
    return () => {
      if (gltfScene) scene.remove(gltfScene);
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
      controls.dispose();
    };
  }, [gltfUrl, width, height]);

  return <div ref={mountRef} style={{ width, height }} />;
}
