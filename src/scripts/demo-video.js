/**
 * Behaviour for `DemoVideo.astro`'s `<video data-demo-video>`. Plain JS with the document and window passed
 * in, so `test/demo-video.test.mjs` runs it on fakes.
 *
 * The `<source>`s carry `data-src`, not `src`: a video with `autoplay` downloads at page load whatever its
 * `preload`, so the files are only named once the video is near the viewport.
 *
 * - `prefers-reduced-motion: reduce`: no autoplay; the poster shows with controls, and the visitor starts it
 *   (the files are still only fetched, as metadata, once the video is near the viewport).
 * - Otherwise: load when it scrolls near, play while on screen, pause when it leaves (saves battery and decoding).
 */
function setSources(video) {
  if (video.hasLoadedSources) return;
  video.hasLoadedSources = true;
  for (const s of video.querySelectorAll('source[data-src]')) s.src = s.dataset.src;
  video.load();
}

export function setUpDemoVideos(doc, win) {
  const videos = [...doc.querySelectorAll('video[data-demo-video]')];
  const reduced = win.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) {
    for (const v of videos) {
      v.removeAttribute('autoplay');
      v.controls = true;
    }
  }
  if (!win.IntersectionObserver) {
    for (const v of videos) setSources(v);
    return;
  }
  const observer = new win.IntersectionObserver(
    (entries) => {
      for (const { target, isIntersecting } of entries) {
        if (isIntersecting) {
          setSources(target);
          if (!reduced) target.play().catch(() => {});
        } else if (!reduced) target.pause();
      }
    },
    { rootMargin: '200px 0px' }
  );
  for (const v of videos) observer.observe(v);
}
