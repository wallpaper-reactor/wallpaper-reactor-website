/**
 * The one builder for VideoObject JSON-LD and for a demo clip's file paths. Plain JS (like
 * `softwareApplication.js`) so the `node --test` suite imports it. `DemoVideo.astro` is the only caller;
 * the clips themselves are listed in `demoClips.js`.
 */

/** Clip `id` -> its files, all under /assets/videos/<id>/. The encode step (scripts/encode-demo-clip.sh) writes these. */
export function clipUrls(id) {
  const base = `/assets/videos/${id}/${id}`;
  return { mp4: `${base}.mp4`, webm: `${base}.webm`, poster: `${base}.webp` };
}

/** Seconds -> ISO 8601 duration, rounded to whole seconds (`PT1M15S`). */
export function isoDuration(seconds) {
  if (!Number.isFinite(seconds) || seconds <= 0) throw new Error(`isoDuration: bad length ${seconds}`);
  const total = Math.round(seconds);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `PT${m ? `${m}M` : ''}${s || !m ? `${s}S` : ''}`;
}

/**
 * @param {{ id: string, name: string, description: string, uploadDate: string, durationSeconds: number, width?: number, height?: number }} clip
 * @param {string} siteUrl
 */
export function videoObjectSchema(clip, siteUrl) {
  for (const k of ['id', 'name', 'description', 'uploadDate', 'durationSeconds']) {
    if (!clip[k]) throw new Error(`videoObjectSchema: clip is missing ${k}`);
  }
  const urls = clipUrls(clip.id);
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: clip.name,
    description: clip.description,
    thumbnailUrl: [`${siteUrl}${urls.poster}`],
    contentUrl: `${siteUrl}${urls.mp4}`,
    uploadDate: clip.uploadDate,
    duration: isoDuration(clip.durationSeconds),
    ...(clip.width ? { width: clip.width } : {}),
    ...(clip.height ? { height: clip.height } : {}),
  };
}
