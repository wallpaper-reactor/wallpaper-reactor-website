---
title: Home
layout: home
nav_order: 1
---

<!-- Hero Section -->
<section class="hero-wrapper" markdown="0">
  <div class="hero-section">
    <div class="hero-content">
      <h1>Live wallpapers with <span class="brand-accent">unlimited power</span></h1>
      <p class="tagline">Run video loops, interactive web scenes, shaders, Godot games, and more — optimized for performance and battery on every device.</p>

      <div class="download-buttons">
        <a href="https://play.google.com/store/apps/details?id=app.wallpaperreactor" class="btn-primary" target="_blank" rel="noopener">Download Android</a>
        <a href="https://apps.microsoft.com/detail/9n4302crdqrl" class="btn-secondary" target="_blank" rel="noopener">Download Windows</a>
        <a href="https://apps.apple.com/us/app/wallpaper-reactor-lite/id6751447022" class="btn-secondary" target="_blank" rel="noopener">Download macOS</a>
        <a href="#pricing" class="btn-outline">Pricing</a>
      </div>

      <p class="hero-subtitle">No account required. Optional sign‑in to sync wallpapers & favorites.</p>
    </div>

    <div class="hero-image">
      <div class="glow-bg"></div>
      <img src="{{ '/assets/images/mockup3.webp' | relative_url }}" alt="Wallpaper Reactor Preview" />
    </div>
  </div>
</section>


<!-- Features Section -->
<section id="features" style="padding: 5rem 0; max-width: 1280px; margin: 0 auto;" markdown="0">
  <div style="padding: 0 1rem;">
    <h2 style="font-size: 1.875rem; font-weight: 600; margin-bottom: 0.5rem;">Everything you need to make your screen alive</h2>
    <p style="color: #a3a3a3; max-width: 42rem; margin-bottom: 2.5rem;">A creator‑friendly pipeline with performance knobs and battery‑aware behavior across Android, Windows, and macOS.</p>

    <div class="feature-grid">
      <article class="feature-card">
        <div class="icon">▶︎</div>
        <h3>Video & Audio</h3>
        <p>Seamless loops, volume controls, and performance presets that adapt to your device.</p>
      </article>

      <article class="feature-card">
        <div class="icon">⌘</div>
        <h3>Web & Shaders</h3>
        <p>Run interactive web canvases and GLSL shaders with battery‑aware frame pacing.</p>
      </article>

      <article class="feature-card">
        <div class="icon">🎮</div>
        <h3>Godot Support</h3>
        <p>Showcase Godot scenes as living wallpapers with simple export.</p>
      </article>

      <article class="feature-card">
        <div class="icon">⚡</div>
        <h3>Battery Smart</h3>
        <p>Auto‑pauses on battery saver, caps FPS on idle, and sleeps on low power.</p>
      </article>

      <article class="feature-card">
        <div class="icon">🖥️</div>
        <h3>Multi‑monitor Ready</h3>
        <p>Per‑display configs on desktop. Preview on Android.</p>
      </article>

      <article class="feature-card">
        <div class="icon">☁️</div>
        <h3>Sync (optional)</h3>
        <p>Sign in to sync favorites; no account required for basic use.</p>
      </article>
    </div>
  </div>
</section>

<!-- Pricing Section -->
<section id="pricing" class="pricing-section" markdown="0">
  <div style="max-width: 1280px; margin: 0 auto; padding: 0 1rem;">
    <div class="pricing-grid">
      <div class="pricing-info">
        <h2>Simple pricing that scales with you</h2>
        <p>Free to try. Pay once to unlock desktop + creator extras, or choose a lightweight subscription for cloud sync & premium packs.</p>
        <ul>
          <li>• Free: basic playback, local wallpapers</li>
          <li>• One‑time: desktop + creator tools</li>
          <li>• Optional yearly: sync, premium packs</li>
        </ul>
      </div>

      <div class="pricing-card">
        <div class="price-header">
          <div>
            <div class="label" style="margin-bottom: 0.25rem;">Creator Pack</div>
            <div class="price">$10<span class="period">/year</span></div>
          </div>
          <div class="label">Cancel anytime</div>
        </div>
        <ul>
          <li>• Cloud sync of favorites</li>
          <li>• Premium wallpaper bundles</li>
          <li>• Early access features</li>
        </ul>
        <a href="#download" class="cta-button">Get the Creator Pack</a>
        <p class="disclaimer">Pricing example — customize to your real plan.</p>
      </div>
    </div>
  </div>
</section>

<!-- FAQ Section -->
<section id="faq" class="faq-section" markdown="0">
  <div style="padding: 0 1rem;">
    <h2>Frequently asked questions</h2>
    <div>
      <details>
        <summary>
          Does it hurt battery life?
          <span class="arrow">▾</span>
        </summary>
        <p>Wallpaper Reactor adapts to your device: it pauses on battery saver, limits FPS when idle, and sleeps on low power.</p>
      </details>

      <details>
        <summary>
          What formats are supported?
          <span class="arrow">▾</span>
        </summary>
        <p>Video (MP4/WebM), web canvases, shaders (GLSL), and Godot scenes. More coming.</p>
      </details>

      <details>
        <summary>
          Do I need an account?
          <span class="arrow">▾</span>
        </summary>
        <p>No. Accounts are optional for sync and premium content.</p>
      </details>

      <details>
        <summary>
          Does it work on all platforms?
          <span class="arrow">▾</span>
        </summary>
        <p>Yes! Wallpaper Reactor is available for Android, Windows, and macOS. Use the same wallpapers across all your devices.</p>
      </details>
    </div>
  </div>
</section>
