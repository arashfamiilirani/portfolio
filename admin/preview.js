// admin/preview.js
import { marked } from 'https://cdn.skypack.dev/marked';
import * as CMS from 'https://unpkg.com/decap-cms@^3.1.2/dist/decap-cms.js';

// Register a preview template for the "pages" collection
CMS.registerPreviewTemplate('pages', (props) => {
  const { entry } = props;
  const data = entry.toJS().data;

  // Build the same HTML structure as your public site
  const siteName = data.site_name || 'ARASH FAMIILIRANI';
  const modules = data.modules || [];

  const renderModules = () => {
    return modules.map((module, idx) => {
      if (module.type === 'text_block') {
        return `<section class="module text_block">${marked(module.body || '')}</section>`;
      } else if (module.type === 'video_block') {
        return `
          <section class="module video_block">
            <iframe src="${module.url}" frameborder="0" allowfullscreen></iframe>
            <div class="caption">${module.caption || ''}</div>
          </section>
        `;
      } else if (module.type === 'audio_block') {
        const tracks = (module.items || []).map(track => `
          <div class="audio-item">
            <iframe src="${track.url}" frameborder="0" scrolling="no"></iframe>
            <div class="caption">${track.caption || ''}</div>
          </div>
        `).join('');
        return `<section class="module audio_block">${tracks}</section>`;
      }
      return '';
    }).join('');
  };

  // Same CSS as your public site (copy from your index.html <style>)
  const css = `
    * { margin:0; padding:0; box-sizing:border-box; }
    body {
      background: #ffffff;
      color: #111111;
      font-family: 'Inter', sans-serif;
      font-weight: 300;
      line-height: 1.5;
    }
    .site-header {
      padding: 2rem 2rem 1rem;
      text-align: center;
      border-bottom: 1px solid #eee;
      margin-bottom: 4rem;
    }
    .site-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.8rem;
      font-weight: 400;
    }
    .container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 0 2rem 6rem;
    }
    .module {
      margin-bottom: 8rem;
    }
    .text_block h1 {
      font-family: 'Cormorant Garamond', serif;
      font-size: 4.5rem;
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
      font-family: 'Inter', sans-serif;
      font-size: 0.75rem;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: #888;
      margin-top: 0.75rem;
    }
    @media (max-width: 768px) {
      .text_block p { max-width: 100%; }
      .text_block h1 { font-size: 3rem; }
    }
  `;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Inter:wght@300;400;500&display=swap" rel="stylesheet">
        <style>${css}</style>
      </head>
      <body>
        <header class="site-header">
          <div class="site-title">${siteName}</div>
        </header>
        <main class="container">
          ${renderModules()}
        </main>
      </body>
    </html>
  `;
});
