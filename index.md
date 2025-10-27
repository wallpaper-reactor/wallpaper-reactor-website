---
title: Home
layout: home
nav_order: 1
---

<!-- Hero Section -->
<section class="hero-wrapper" markdown="0">
  <div class="hero-section">
    <div class="hero-content">
      <img src="{{ '/assets/images/logo.png' | relative_url }}" alt="Wallpaper Reactor Logo" class="hero-logo" />
      <h1>Live wallpapers with<br><span class="brand-accent">unlimited power</span></h1>
      <p class="tagline">Run 4K video loops, interactive web scenes, shaders, Godot games, and more — optimized for performance and battery on every device.</p>

      <div class="download-buttons">
        <a href="https://play.google.com/store/apps/details?id=app.wallpaperreactor" class="btn-primary" target="_blank" rel="noopener">
          <img src="{{ '/assets/images/android-logo-fill.svg' | relative_url }}" alt="" class="btn-icon" />
          Download Android
        </a>
        <a href="https://apps.microsoft.com/detail/9n4302crdqrl" class="btn-primary" target="_blank" rel="noopener">
          <img src="{{ '/assets/images/windows-logo-fill.svg' | relative_url }}" alt="" class="btn-icon" />
          Download Windows
        </a>
        <a href="https://apps.apple.com/us/app/wallpaper-reactor-lite/id6751447022" class="btn-primary" target="_blank" rel="noopener">
          <img src="{{ '/assets/images/apple-logo-fill.svg' | relative_url }}" alt="" class="btn-icon" />
          Download macOS
        </a>
      </div>

      <p class="hero-subtitle">No account required. Optional sign‑in to sync wallpapers & favorites.</p>
    </div>
  </div>
</section>

<!-- Video Showcase Section -->
<section class="video-showcase-section" markdown="0">
  <div class="video-overlay" id="videoOverlay"></div>
  <div class="video-showcase-container">
    <h2 class="video-showcase-title">See it in action</h2>
    <div class="video-grid">
      <div class="video-item">
        <video autoplay loop muted playsinline preload="metadata">
          <source src="{{ '/assets/videos/halo.mp4' | relative_url }}" type="video/mp4">
          Your browser does not support the video tag.
        </video>
      </div>
      <div class="video-item">
        <video autoplay loop muted playsinline preload="metadata">
          <source src="{{ '/assets/videos/star-citizen.mp4' | relative_url }}" type="video/mp4">
          Your browser does not support the video tag.
        </video>
      </div>
      <div class="video-item">
        <video autoplay loop muted playsinline preload="metadata">
          <source src="{{ '/assets/videos/synthwave.mp4' | relative_url }}" type="video/mp4">
          Your browser does not support the video tag.
        </video>
      </div>
      <div class="video-item">
        <video autoplay loop muted playsinline preload="metadata">
          <source src="{{ '/assets/videos/ps3.mp4' | relative_url }}" type="video/mp4">
          Your browser does not support the video tag.
        </video>
      </div>
      <div class="video-item video-item-mobile-hidden">
        <video autoplay loop muted playsinline preload="metadata">
          <source src="{{ '/assets/videos/jake.mp4' | relative_url }}" type="video/mp4">
          Your browser does not support the video tag.
        </video>
      </div>
      <div class="video-item video-item-mobile-hidden">
        <video autoplay loop muted playsinline preload="metadata">
          <source src="{{ '/assets/videos/f1.mp4' | relative_url }}" type="video/mp4">
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  </div>

</section>

<script src="{{ '/assets/js/video-expand.js' | relative_url }}"></script>

<!-- Features Section -->
<section id="features" style="padding: 2rem 0; max-width: 1280px; margin: 0 auto;" markdown="0">
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
        <p>Auto‑pauses on battery saver, includes power-saving mdoes, and has great performance.</p>
      </article>

      <article class="feature-card">
        <div class="icon">🖥️</div>
        <h3>Multi‑monitor Ready</h3>
        <p>Per‑display configs on desktop and Android.</p>
      </article>

      <article class="feature-card">
        <div class="icon">☁️</div>
        <h3>Sync (optional)</h3>
        <p>Sign in to sync favorites; no account required for basic use.</p>
      </article>
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
        <p>Wallpaper Reactor adapts to your device: it pauses on battery saver automatically, has power-saving modes, and is designed with battery life in mind.</p>
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
