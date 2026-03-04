/**
 * In-memory cache for GLB/GLTF models by URL.
 * Returns the same parsed GLTF on repeat visits so the model appears instantly.
 */

export interface CachedGLTF {
  scene: import('three').Group;
}

const glbCache = new Map<string, CachedGLTF>();

export type GLTFLoaderLike = {
  loadAsync: (url: string) => Promise<CachedGLTF>;
};

/**
 * Load a GLB from URL, or return the cached result if already loaded.
 * Callers should use gltf.scene.clone(true) so the cached scene is not mutated.
 */
export async function getCachedGltf(
  loader: GLTFLoaderLike,
  url: string
): Promise<CachedGLTF> {
  const cached = glbCache.get(url);
  if (cached) return cached;
  const gltf = await loader.loadAsync(url);
  glbCache.set(url, gltf);
  return gltf;
}
