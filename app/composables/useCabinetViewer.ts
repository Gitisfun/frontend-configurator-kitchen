import type { Ref } from 'vue';
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue';
import type { Scene, Object3D, Mesh, MeshStandardMaterial, Material, Group, Texture } from 'three';
import { getCachedGltf } from './useGlbCache';

/** Selection options must have at least an image string (or null) for the 3D material */
export interface CabinetViewerSelections {
  plinthSelection: Ref<{ image: string | null } | null>;
  frontSelection: Ref<{ image: string | null } | null>;
  sideSelection: Ref<{ image: string | null } | null>;
}

function isImageUrl(value: string): boolean {
  if (!value || typeof value !== 'string') return false;
  return value.startsWith('/') || value.startsWith('http') || value.startsWith('data:');
}

function disposeMaterial(mat: Material): void {
  if (!mat) return;
  const m = mat as MeshStandardMaterial;
  const maps: Array<Texture | null | undefined> = [m.map, m.normalMap, m.roughnessMap, m.aoMap];
  for (const tex of maps) {
    if (!tex) continue;
    if (tex.userData?.sharedViewerMap) continue;
    tex.dispose();
  }
  mat.dispose();
}

export function useCabinetViewer(containerRef: Ref<HTMLElement | null>, selections: CabinetViewerSelections) {
  const canvasMounted = ref(false);
  const modelLoaded = ref(false);
  let scene: Scene | null = null;
  let camera: InstanceType<Awaited<typeof import('three')>['PerspectiveCamera']> | null = null;
  let renderer: InstanceType<Awaited<typeof import('three')>['WebGLRenderer']> | null = null;
  let animationId: number | null = null;
  let resizeHandler: (() => void) | null = null;
  let cabinetModel: Group | null = null;
  let container: HTMLElement | null = null;

  onMounted(async () => {
    canvasMounted.value = true;
    modelLoaded.value = false;
    await nextTick();
    if (!containerRef.value) return;

    const THREE = await import('three');
    const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
    const { RGBELoader } = await import('three/examples/jsm/loaders/RGBELoader.js');

    container = containerRef.value;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const pageBg =
      typeof document !== 'undefined'
        ? getComputedStyle(document.body).backgroundColor || '#ffffff'
        : '#ffffff';
    const bgColor = new THREE.Color(pageBg);

    scene = new THREE.Scene();
    scene.background = bgColor;

    camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 1000);
    camera.position.set(2.2, 1.2, 3);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(bgColor, 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = false;
    container.appendChild(renderer.domElement);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const rgbeLoader = new RGBELoader();
    const hdrTexture = await rgbeLoader.loadAsync('/studio_small_09_2k.hdr');
    hdrTexture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = pmremGenerator.fromEquirectangular(hdrTexture).texture;
    hdrTexture.dispose();
    pmremGenerator.dispose();

    const keyLight = new THREE.DirectionalLight(0xffffff, 0.5);
    keyLight.position.set(0, 4.5, 3);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xdbe4f0, 0.25);
    fillLight.position.set(-3, 2, -1);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xfff4e6, 0.3);
    rimLight.position.set(-1, 3, -3);
    scene.add(rimLight);

    const loader = new GLTFLoader();
    const envMap = scene.environment;
    const textureLoader = new THREE.TextureLoader();
    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();

    function applyMaterialToMesh(mesh: Mesh, value: string | null, roughness: number, partType: 'door' | 'side' | 'plinth'): Promise<void> {
      const hasSelection = !!value;

      function makeMaterial(opts: { map?: Texture; color?: string; roughness: number; useSharedMaps: boolean; transparent?: boolean; opacity?: number }) {
        const isDoor = partType === 'door';
        const isSide = partType === 'side';
        return new THREE.MeshPhysicalMaterial({
          color: opts.color,
          map: opts.map,
          roughness: isDoor ? 0.08 : isSide ? 0.25 : opts.roughness,
          metalness: 0.04,
          transparent: opts.transparent ?? false,
          opacity: opts.opacity ?? 1,
          envMap,
          envMapIntensity: isDoor ? 1.2 : isSide ? 0.5 : 0.4,
          clearcoat: isDoor ? 0.95 : isSide ? 0.3 : 0.15,
          clearcoatRoughness: isDoor ? 0.03 : isSide ? 0.15 : 0.3,
          reflectivity: isDoor ? 0.75 : 0.4,
          ior: isDoor ? 1.7 : 1.5,
        });
      }

      const oldMat = mesh.material;
      const mats = Array.isArray(oldMat) ? oldMat : [oldMat];
      for (const m of mats) if (m) disposeMaterial(m as Material);

      if (!hasSelection) {
        (mesh as Mesh).material = makeMaterial({
          color: '#c7ccd1',
          roughness: 0.85,
          useSharedMaps: false,
          transparent: false,
          opacity: 1,
        });
        return Promise.resolve();
      }

      if (isImageUrl(value)) {
        return textureLoader
          .loadAsync(value)
          .then((tex) => {
            tex.colorSpace = THREE.SRGBColorSpace;
            tex.minFilter = THREE.LinearMipmapLinearFilter;
            tex.magFilter = THREE.LinearFilter;
            tex.anisotropy = maxAnisotropy;
            (mesh as Mesh).material = makeMaterial({ map: tex, roughness, useSharedMaps: true });
          })
          .catch(() => {
            (mesh as Mesh).material = makeMaterial({
              color: '#c7ccd1',
              roughness: 0.85,
              useSharedMaps: false,
              transparent: false,
              opacity: 1,
            });
          });
      }
      (mesh as Mesh).material = makeMaterial({ color: value, roughness, useSharedMaps: true });
      return Promise.resolve();
    }

    async function updateCabinetMaterials(): Promise<void> {
      if (!cabinetModel) return;
      const partKeys = ['door', 'side', 'top'];
      const updates: Promise<void>[] = [];
      cabinetModel.traverse((child: Object3D) => {
        if (!(child as Mesh).isMesh) return;
        const mesh = child as Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        const name = (mesh.name ?? '').toLowerCase();
        const key = partKeys.find((k) => name === k || name.includes(k));
        const isPlinth = name === 'plinth' || name.includes('plinth');
        if (!key && !isPlinth) return;
        const value = isPlinth ? (selections.plinthSelection.value?.image ?? null) : key === 'door' ? (selections.frontSelection.value?.image ?? null) : key ? (selections.sideSelection.value?.image ?? null) : null;
        const roughness = isPlinth ? 0.35 : 0.08;
        const partType: 'door' | 'side' | 'plinth' = isPlinth ? 'plinth' : key === 'door' ? 'door' : 'side';
        updates.push(applyMaterialToMesh(mesh, value, roughness, partType));
      });
      await Promise.all(updates);
    }

    try {
      const gltf = await getCachedGltf(loader, '/configkitchencorrect.glb');
      const model = gltf.scene.clone(true) as Group;
      cabinetModel = model;
      scene.add(model);

      await updateCabinetMaterials();

      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      model.position.sub(center);
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 1.35 / maxDim;
      model.scale.setScalar(scale);
      model.position.y -= size.y * scale * 0.2;

      if (renderer && scene && camera) {
        renderer.render(scene, camera);
      }
      modelLoaded.value = true;
    } catch (e) {
      console.warn('Could not load configkitchencorrect.glb:', e);
      modelLoaded.value = true;
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
      void updateCabinetMaterials();
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

  return { canvasMounted, modelLoaded };
}
