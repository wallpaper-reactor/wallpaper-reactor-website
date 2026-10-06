/**
 * Explains an OAuth failure that Supabase couldn't redirect back to the app.
 *
 * When sign-in fails before Supabase can hand control back to the app (an expired PKCE
 * flow, say), it falls back to the project's Site URL — this site — and appends
 * `error`, `error_code` and `error_description`. Depending on the flow they arrive in
 * the query string or in the fragment, so both are read. Without this the visitor lands
 * on the home page with a mangled URL and no explanation.
 *
 * Self-contained (no imports) so the tests can load the exact source into a browser.
 */

const PARAMS = ['error', 'error_code', 'error_description'];

const EXPIRED = 'Your sign-in link expired. Go back to Wallpaper Reactor and sign in again.';
const CANCELLED = 'Sign-in was cancelled.';
const GENERIC = "Sign-in didn't finish. Go back to Wallpaper Reactor and try again.";

const paramsOf = (raw, prefix) => new URLSearchParams(raw.startsWith(prefix) ? raw.slice(1) : raw);

/** @returns {{error: string, code: string, description: string} | null} */
export function parseAuthError(search, hash) {
  const query = paramsOf(search, '?');
  const fragment = paramsOf(hash, '#');
  const read = (key) => query.get(key) || fragment.get(key) || '';
  const [error, code, description] = PARAMS.map(read);
  return error || code || description ? { error, code, description } : null;
}

/** @returns {{message: string, detail: string}} */
export function describeAuthError({ error, code, description }) {
  if (/expired/i.test(code) || /expired/i.test(description)) return { message: EXPIRED, detail: '' };
  if (error === 'access_denied' || code === 'access_denied') return { message: CANCELLED, detail: '' };
  return { message: GENERIC, detail: description };
}

/** Removes the auth params, keeping everything else (including plain `#anchor` fragments). */
export function stripAuthError(search, hash) {
  const strip = (raw, prefix) => {
    if (!raw.startsWith(prefix) || (prefix === '#' && !raw.includes('='))) return raw;
    const params = new URLSearchParams(raw.slice(1));
    PARAMS.forEach((key) => params.delete(key));
    const rest = params.toString();
    return rest ? prefix + rest : '';
  };
  return { search: strip(search, '?'), hash: strip(hash, '#') };
}

/** Builds with textContent only — the provider's description is untrusted. */
function buildNotice(doc, { message, detail }) {
  const el = (tag, className, text) => {
    const node = doc.createElement(tag);
    node.className = className;
    if (text) node.textContent = text;
    return node;
  };

  const root = el('div', 'border-b border-brand-400/40 bg-surface-800 text-ink-100');
  root.setAttribute('role', 'alert');
  root.dataset.authError = '';

  const inner = el('div', 'mx-auto flex max-w-7xl items-start gap-4 px-4 py-3');
  const body = el('div', 'min-w-0 flex-1');
  body.append(el('p', 'm-0 font-medium', message));

  if (detail) {
    const details = el('details', 'mt-1 text-sm text-ink-400');
    details.append(el('summary', 'cursor-pointer', 'Details'), el('p', 'mt-1 break-words', detail));
    body.append(details);
  }

  const support = el('a', 'mt-1 inline-block text-sm text-brand-400 underline hover:text-brand-hover', 'Contact support');
  support.href = '/support/';
  body.append(support);

  const dismiss = el(
    'button',
    'shrink-0 rounded-lg px-2.5 py-1 text-xl leading-none text-ink-300 hover:bg-white/5 hover:text-ink-100 focus-visible:outline-2 focus-visible:outline-brand-400'
  );
  dismiss.type = 'button';
  dismiss.setAttribute('aria-label', 'Dismiss sign-in notice');
  dismiss.textContent = '×';
  dismiss.addEventListener('click', () => root.remove());

  inner.append(body, dismiss);
  root.append(inner);
  return root;
}

export function showAuthError(win) {
  const { search, hash, pathname } = win.location;
  const parsed = parseAuthError(search, hash);
  if (!parsed) return;

  win.document.body.prepend(buildNotice(win.document, describeAuthError(parsed)));

  // Drop the params so a refresh or a shared link doesn't replay the error.
  const next = stripAuthError(search, hash);
  win.history.replaceState(win.history.state, '', pathname + next.search + next.hash);
}
