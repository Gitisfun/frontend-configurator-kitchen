import type { Ref } from 'vue';
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue';
import type { Scene, Object3D, Mesh, MeshStandardMaterial, Material, Group, Texture } from 'three';

/** Selection options must have at least an image string for the 3D material */
export interface CabinetViewerSelections {
  plinthSelection: Ref<{ image: string } | null>;
  frontSelection: Ref<{ image: string } | null>;
  sideSelection: Ref<{ image: string } | null>;
}

function isImageUrl(value: string): boolean {
  if (!value || typeof value !== 'string') return false;
  return value.startsWith('/') || value.startsWith('http') || value.startsWith('data:');
}

function disposeMaterial(mat: Material): void {
  if (!mat) return;
  const m = mat as MeshStandardMaterial;
  if (m.map) {
    m.map.dispose();
  }
  mat.dispose();
}

export function useCabinetViewer(containerRef: Ref<HTMLElement | null>, selections: CabinetViewerSelections) {
  const canvasMounted = ref(false);
  let scene: Scene | null = null;
  let camera: InstanceType<Awaited<typeof import('three')>['PerspectiveCamera']> | null = null;
  let renderer: InstanceType<Awaited<typeof import('three')>['WebGLRenderer']> | null = null;
  let animationId: number | null = null;
  let resizeHandler: (() => void) | null = null;
  let cabinetModel: Group | null = null;
  let container: HTMLElement | null = null;

  onMounted(async () => {
    canvasMounted.value = true;
    await nextTick();
    if (!containerRef.value) return;

    const THREE = await import('three');
    const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
    const { RoomEnvironment } = await import('three/examples/jsm/environments/RoomEnvironment.js');

    container = containerRef.value;
    const width = container.clientWidth;
    const height = container.clientHeight;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 1000);
    camera.position.set(2.2, 1.2, 3);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envMap = pmremGenerator.fromScene(roomEnv).texture;
    pmremGenerator.dispose();

    const ambient = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambient);
    const hemisphere = new THREE.HemisphereLight(0xf5f5ff, 0xe8e8e0, 0.35);
    scene.add(hemisphere);
    const keyLight = new THREE.DirectionalLight(0xfff5e6, 1.35);
    keyLight.position.set(3, 5, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 15;
    keyLight.shadow.camera.left = -2;
    keyLight.shadow.camera.right = 2;
    keyLight.shadow.camera.top = 2;
    keyLight.shadow.camera.bottom = -2;
    keyLight.shadow.bias = -0.0001;
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0xe0e8ff, 0.55);
    rimLight.position.set(-2, 2, -3);
    scene.add(rimLight);

    const loader = new GLTFLoader();
    const textureLoader = new THREE.TextureLoader();
    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();

    function applyMaterialToMesh(mesh: Mesh, value: string | null, roughness: number): void {
      const fallbackHex = '#ffffff';
      const val = value ?? fallbackHex;

      function makeMaterial(opts: { map?: Texture; color?: string; roughness: number }) {
        const mat = new THREE.MeshStandardMaterial({
          ...opts,
          metalness: 0,
          envMap,
          envMapIntensity: 0.35,
        });
        return mat;
      }

      if (isImageUrl(val)) {
        textureLoader.load(
          val,
          (tex) => {
            tex.colorSpace = THREE.SRGBColorSpace;
            tex.minFilter = THREE.LinearMipmapLinearFilter;
            tex.magFilter = THREE.LinearFilter;
            tex.anisotropy = maxAnisotropy;
            const oldMat = mesh.material;
            const mats = Array.isArray(oldMat) ? oldMat : [oldMat];
            for (const m of mats) if (m) disposeMaterial(m as Material);
            (mesh as Mesh).material = makeMaterial({ map: tex, roughness });
          },
          undefined,
          () => {
            const oldMat = mesh.material;
            const mats = Array.isArray(oldMat) ? oldMat : [oldMat];
            for (const m of mats) if (m) disposeMaterial(m as Material);
            (mesh as Mesh).material = makeMaterial({ color: fallbackHex, roughness });
          }
        );
      } else {
        const oldMat = mesh.material;
        const mats = Array.isArray(oldMat) ? oldMat : [oldMat];
        for (const m of mats) if (m) disposeMaterial(m as Material);
        (mesh as Mesh).material = makeMaterial({ color: val, roughness });
      }
    }

    function updateCabinetMaterials(): void {
      if (!cabinetModel) return;
      const partKeys = ['door', 'side', 'top'];
      cabinetModel.traverse((child: Object3D) => {
        if (!(child as Mesh).isMesh) return;
        const mesh = child as Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        const name = (mesh.name ?? '').toLowerCase();
        const key = partKeys.find((k) => name === k || name.includes(k));
        const isPlinth = name === 'plinth' || name.includes('plinth');
        if (!key && !isPlinth) return;
        const value = isPlinth ? selections.plinthSelection.value?.image ?? null : key === 'door' ? selections.frontSelection.value?.image ?? null : key ? selections.sideSelection.value?.image ?? null : null;
        const roughness = isPlinth ? 0.6 : 0.42;
        applyMaterialToMesh(mesh, value, roughness);
      });
    }

    try {
      const gltf = await loader.loadAsync('/configkitchencorrect.glb');
      const model = gltf.scene;
      cabinetModel = model;
      scene.add(model);

      updateCabinetMaterials();

      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      model.position.sub(center);
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 1.35 / maxDim;
      model.scale.setScalar(scale);
      model.position.y -= size.y * scale * 0.2;

      const groundGeometry = new THREE.PlaneGeometry(8, 8);
      const groundMaterial = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        depthWrite: false,
      });
      const ground = new THREE.Mesh(groundGeometry, groundMaterial);
      ground.rotation.x = -Math.PI / 2;
      ground.position.y = model.position.y - (size.y * scale) / 2 - 0.02;
      ground.receiveShadow = true;
      scene.add(ground);
    } catch (e) {
      console.warn('Could not load configkitchencorrectbeveled.glb:', e);
    }

    function animate() {
      animationId = requestAnimationFrame(animate);
      if (renderer && scene && camera) renderer.render(scene, camera);
    }
    animate();

    resizeHandler = () => {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', resizeHandler);

    watch([selections.plinthSelection, selections.frontSelection, selections.sideSelection], () => {
      updateCabinetMaterials();
    });
  });

  onUnmounted(() => {
    if (resizeHandler) window.removeEventListener('resize', resizeHandler);
    if (animationId !== null) cancelAnimationFrame(animationId);
    if (renderer && container?.contains(renderer.domElement)) {
      renderer.domElement.remove();
      renderer.dispose();
    }
    renderer = null;
    scene = null;
    camera = null;
    cabinetModel = null;
    container = null;
  });

  return { canvasMounted };
}
