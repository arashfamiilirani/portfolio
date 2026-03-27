import { marked } from 'https://cdn.skypack.dev/marked';
import * as CMS from 'https://unpkg.com/decap-cms@^3.1.2/dist/decap-cms.js';

CMS.registerPreviewTemplate('pages', (props) => {
  const { entry } = props;
  const data = entry.toJS().data;
  const siteName = data.site_name || 'ARASH FAMIILIRANI';
  const modules = data.modules || [];
  const theme = data.theme || {};

  // Build modules HTML
  const renderModules = () => {
    return modules.map((module, idx) => {
      const anchorId = `module-${idx}`;
      let content = '';
      let navLabel = '';
      if (module.type === 'text_block') {
        navLabel = module.title || `Section ${idx+1}`;
        content = marked(module.body || '');
      } else if (module.type === 'video_block') {
        navLabel = module.caption || `Video ${idx+1}`;
        content = `
          <iframe src="${module.url}" frameborder="0" allowfullscreen></iframe>
          <div class="caption">${module.caption || ''}</div>
        `;
      } else if (module.type === 'audio_block') {
        navLabel = module.caption || `Audio ${idx+1}`;
        const tracks = (module.items || []).map(track => `
          <div class="audio-item">
            <iframe src="${track.url}" frameborder="0" scrolling="no"></iframe>
            <div class="caption">${track.caption || ''}</div>
          </div>
        `).join('');
        content = tracks;
      }
      return `
        <section class="module ${module.type}" id="${anchorId}">
          ${content}
        </section>
      `;
    }).join('');
  };

  // Navigation links HTML
  const navLinks = modules.map((module, idx) => {
    let label = '';
    if (module.type === 'text_block') label = module.title;
    else if (module.type === 'video_block') label = module.caption;
    else if (module.type === 'audio_block') label = module.caption;
    if (!label) label = `Section ${idx+1}`;
    return `<a href="#module-${idx}">${label}</a>`;
  }).join('');

  // CSS that uses the theme variables
  const css = `
    :root {
      --bg: ${theme.bg || '#ffffff'};
      --text: ${theme.text || '#111111'};
      --accent: ${theme.accent || '#000000'};
      --heading-font: ${theme.heading_font || 'Cormorant Garamond, serif'};
      --body-font: ${theme.body_font || 'Inter, sans-serif'};
      --heading-size: ${theme.heading_size || '4.5rem'};
    }
    * { margin:0; padding:0; box-sizing:border-box; }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: var(--body-font);
      font-weight: 300;
      line-height: 1.5;
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
    }
    .nav-links a {
      font-family: var(--body-font);
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text);
      text-decoration: none;
    }
    .nav-links a:hover { color: var(--accent); }
    .container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 2rem 2rem 6rem;
    }
    .module {
      margin-bottom: 6rem;
      scroll-margin-top: 100px;
    }
    .text_block h1, .text_block h2, .text_block h3 {
      font-family: var(--heading-font);
    }
    .text_block h1 {
      font-size: var(--heading-size);
      line-height: 1.1;
      margin: 2rem 0 1rem;
    }
    .text_block p {
      font-size: 1.2rem;
      line-height: 1.6;
      margin-bottom: 1.5rem;
      max-width: 85%;
    }
    .video_block iframe {
      width: 100%;
      aspect-ratio: 16/9;
      border: none;
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
      .nav-links { justify-content: center; }
      .text_block p { max-width: 100%; }
      .text_block h1 { font-size: calc(var(--heading-size) * 0.7); }
    }
  `;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Inter:wght@300;400;500&family=Playfair+Display:wght@400;500&family=Open+Sans:wght@300;400&display=swap" rel="stylesheet">
        <style>${css}</style>
      </head>
      <body>
        <header class="site-header">
          <div class="site-title">${siteName}</div>
          <div class="nav-links">${navLinks}</div>
        </header>
        <main class="container">
          ${renderModules()}
        </main>
      </body>
    </html>
  `;
});
