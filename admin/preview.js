import { marked } from 'https://cdn.skypack.dev/marked';
import * as CMS from 'https://unpkg.com/decap-cms@^3.1.2/dist/decap-cms.js';

CMS.registerPreviewTemplate('pages', (props) => {
  const { entry } = props;
  const data = entry.toJS().data;
  const siteName = data.site_name || 'ARASH FAMIILIRANI';
  const homeLabel = data.home_label || 'Home';
  const sections = data.sections || [];
  const social = data.social_links || {};
  const theme = data.theme || {};
  const hero = data.hero || {};

  function convertYouTubeUrl(url) {
    if (!url) return url;
    if (url.includes('/embed/') || url.includes('youtube.com/embed/')) return url;
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1].split('?')[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes('watch?v=')) {
      const id = url.split('v=')[1].split('&')[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes('/shorts/')) {
      const id = url.split('/shorts/')[1].split('?')[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    return url;
  }

  const socialHtml = `
    ${social.instagram ? `<a href="${social.instagram}" target="_blank"><i class="fab fa-instagram"></i></a>` : ''}
    ${social.youtube ? `<a href="${social.youtube}" target="_blank"><i class="fab fa-youtube"></i></a>` : ''}
    ${social.soundcloud ? `<a href="${social.soundcloud}" target="_blank"><i class="fab fa-soundcloud"></i></a>` : ''}
    ${social.spotify ? `<a href="${social.spotify}" target="_blank"><i class="fab fa-spotify"></i></a>` : ''}
    ${social.email ? `<a href="mailto:${social.email}"><i class="fas fa-envelope"></i></a>` : ''}
  `;

  const navLinks = `
    <a data-section="hero">${homeLabel}</a>
    ${sections.map((section, idx) => `<a data-section="section-${idx}">${section.title || 'Untitled'}</a>`).join('')}
  `;

  const heroHtml = `
    <div class="hero" id="hero-section">
      ${hero.image ? `<img src="${hero.image}" alt="Hero">` : ''}
      ${hero.credit ? `<div class="credit">${hero.credit}</div>` : ''}
    </div>
  `;

  const sectionsHtml = sections.map((section, idx) => {
    let contentHtml = '';
    const style = section.style || {};
    let headingStyles = '';
    if (style.heading_color) headingStyles += `color: ${style.heading_color}; `;
    if (style.heading_size) headingStyles += `font-size: ${style.heading_size}; `;

    if (section.type === 'bio') {
      let bodyHtml = marked(section.body || '');
      if (headingStyles) {
        bodyHtml = bodyHtml.replace(/<h1([^>]*)>/, `<h1 style="${headingStyles}" $1>`);
        bodyHtml = bodyHtml.replace(/<h2([^>]*)>/, `<h2 style="${headingStyles}" $1>`);
      }
      contentHtml = bodyHtml;
    } else if (section.type === 'video_reel') {
      const videos = section.videos || [];
      const layout = section.layout === 'grid' ? 'video-grid' : 'video-list';
      contentHtml = `
        <h2 class="section-title" style="${headingStyles}">${section.title}</h2>
        <div class="${layout}">
          ${videos.map(v => `
            <div class="video-item">
              <iframe src="${convertYouTubeUrl(v.url)}" frameborder="0" allowfullscreen></iframe>
              ${v.caption ? `<div class="caption">${v.caption}</div>` : ''}
            </div>
          `).join('')}
        </div>
      `;
    } else if (section.type === 'music') {
      const tracks = section.tracks || [];
      const layout = section.layout === 'grid' ? 'audio-grid' : 'audio-list';
      contentHtml = `
        <h2 class="section-title" style="${headingStyles}">${section.title}</h2>
        <div class="${layout}">
          ${tracks.map(t => `
            <div class="audio-item">
              <iframe src="${t.url}" frameborder="0" scrolling="no"></iframe>
              ${t.caption ? `<div class="caption">${t.caption}</div>` : ''}
            </div>
          `).join('')}
        </div>
      `;
    } else if (section.type === 'sound_design') {
      const tracks = section.tracks || [];
      const layout = section.layout === 'grid' ? 'audio-grid' : 'audio-list';
      contentHtml = `
        <h2 class="section-title" style="${headingStyles}">${section.title}</h2>
        <div class="${layout}">
          ${tracks.map(t => `
            <div class="audio-item">
              <iframe src="${t.url}" frameborder="0" scrolling="no"></iframe>
              ${t.caption ? `<div class="caption">${t.caption}</div>` : ''}
            </div>
          `).join('')}
        </div>
      `;
    } else if (section.type === 'contact') {
      let contactHtml = marked(section.text || '<p>Contact me via the social links above.</p>');
      if (headingStyles) {
        contactHtml = contactHtml.replace(/<h2([^>]*)>/, `<h2 style="${headingStyles}" $1>`);
      }
      contentHtml = contactHtml;
    }

    // Wrap with text color/font overrides
    let wrapperStyles = '';
    if (style.text_color) wrapperStyles += `color: ${style.text_color}; `;
    if (style.font_family && style.font_family !== 'inherit') wrapperStyles += `font-family: ${style.font_family}; `;
    if (wrapperStyles) contentHtml = `<div style="${wrapperStyles}">${contentHtml}</div>`;

    return `<div class="section ${section.type}" id="section-${idx}">${contentHtml}</div>`;
  }).join('');

  // CSS (same as front-end with expanded fonts)
  const css = `
    :root {
      --bg: ${theme.bg || '#ffffff'};
      --text: ${theme.text || '#111111'};
      --accent: ${theme.accent || '#000000'};
      --heading-font: ${theme.heading_font || 'Cormorant Garamond, serif'};
      --body-font: ${theme.body_font || 'Inter, sans-serif'};
      --heading-size: ${theme.heading_size || '4.5rem'};
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: var(--body-font);
      font-weight: 300;
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
    }
    .site-header {
      position: sticky;
      top: 0;
      background: var(--bg);
      border-bottom: 1px solid rgba(0,0,0,0.1);
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      z-index: 100;
      backdrop-filter: blur(8px);
    }
    .site-title {
      font-family: var(--heading-font);
      font-size: 1.4rem;
      font-weight: 500;
      letter-spacing: -0.01em;
      color: var(--text);
    }
    .nav-links {
      display: flex;
      gap: 1.5rem;
      flex-wrap: wrap;
      align-items: center;
    }
    .nav-links a {
      font-family: var(--body-font);
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text);
      text-decoration: none;
      cursor: pointer;
      padding: 0.5rem 0;
      display: inline-block;
    }
    .nav-links a:hover { color: var(--accent); }
    .social-icons {
      display: flex;
      gap: 1rem;
      margin-left: 1rem;
    }
    .social-icons a {
      font-size: 1.2rem;
      color: var(--text);
      text-decoration: none;
      padding: 0.5rem;
    }
    .main-content {
      max-width: 1000px;
      margin: 0 auto;
      padding: 2rem 2rem 6rem;
    }
    .hero img {
      max-width: 100%;
      height: auto;
    }
    .hero .credit {
      font-size: 0.75rem;
      color: var(--text);
      opacity: 0.6;
      margin-top: 0.5rem;
    }
    .section {
      display: none;
      animation: fadeIn 0.3s ease;
    }
    .section.active {
      display: block;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .bio h1 {
      font-size: var(--heading-size);
      line-height: 1.1;
      margin: 2rem 0 1rem;
    }
    .bio p {
      font-size: 1.2rem;
      line-height: 1.6;
      margin-bottom: 1.5rem;
      max-width: 85%;
    }
    .video_reel .video-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 2rem;
      margin-top: 1.5rem;
    }
    .video_reel .video-list {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      margin-top: 1.5rem;
    }
    .video-item iframe {
      width: 100%;
      aspect-ratio: 16 / 9;
      border: none;
    }
    .music .audio-grid, .sound_design .audio-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 2rem;
      margin-top: 1.5rem;
    }
    .music .audio-list, .sound_design .audio-list {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      margin-top: 1.5rem;
    }
    .audio-item iframe {
      width: 100%;
      height: 166px;
      border: none;
    }
    .caption {
      font-size: 0.75rem;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: var(--text);
      opacity: 0.7;
      margin-top: 0.5rem;
    }
    @media (max-width: 768px) {
      .site-header { flex-direction: column; gap: 0.5rem; text-align: center; }
      .nav-links { justify-content: center; gap: 1rem; }
      .social-icons { margin-left: 0; justify-content: center; }
      .bio p { max-width: 100%; }
      .bio h1 { font-size: calc(var(--heading-size) * 0.7); }
      .video-grid, .audio-grid { grid-template-columns: 1fr; }
    }
  `;

  const script = `
    <script>
      function initPreview() {
        const hero = document.getElementById('hero-section');
        const sections = document.querySelectorAll('.section');
        const navLinks = document.querySelectorAll('.nav-links a');
        function showHero() {
          if (hero) hero.style.display = 'block';
          sections.forEach(s => s.classList.remove('active'));
        }
        function showSection(id) {
          if (hero) hero.style.display = 'none';
          sections.forEach(s => s.classList.remove('active'));
          const target = document.getElementById(id);
          if (target) target.classList.add('active');
        }
        navLinks.forEach(link => {
          link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('data-section');
            if (targetId === 'hero') showHero();
            else showSection(targetId);
          });
        });
        showHero();
      }
      window.addEventListener('DOMContentLoaded', initPreview);
    <\/script>
  `;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Inter:wght@300;400;500&family=Playfair+Display:wght@400;500&family=Open+Sans:wght@300;400&family=Roboto:wght@300;400&family=Montserrat:wght@300;400&family=Lato:wght@300;400&family=Poppins:wght@300;400&family=Merriweather:wght@300;400&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
        <style>${css}</style>
      </head>
      <body>
        <header class="site-header">
          <div class="site-title">${siteName}</div>
          <div class="nav-links">${navLinks}</div>
          <div class="social-icons">${socialHtml}</div>
        </header>
        <main class="main-content">
          ${heroHtml}
          ${sectionsHtml}
        </main>
        ${script}
      </body>
    </html>
  `;
});