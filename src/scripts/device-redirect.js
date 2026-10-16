/**
 * `wallpaperreactor.app/device/` is the address `wr login` prints; the approval page itself is the web app's
 * `/device` (the main repo's docs/WR-CLIENT.md, _Device sign-in_). Only a code-shaped `?code=` is carried over,
 * so the link cannot put anything else on the approval page. The page never approves from a link: the person
 * still continues, reads who is asking, and presses Approve.
 */
export function deviceTarget(search, webApp) {
  const code = new URLSearchParams(search).get('code') ?? '';
  const target = `${webApp}/device`;
  return /^[A-Za-z]{4}-?[A-Za-z]{4}$/.test(code) ? `${target}?code=${code}` : target;
}
