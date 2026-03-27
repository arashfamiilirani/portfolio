import { marked } from 'https://cdn.skypack.dev/marked';
import * as CMS from 'https://unpkg.com/decap-cms@^3.1.2/dist/decap-cms.js';

CMS.registerPreviewTemplate('pages', (props) => {
  const { entry } = props;
  const data = entry.toJS().data;
  const siteName = data.site_name || 'ARASH FAMIILIRANI';
  const sections = data.sections || [];
  const social = data.social_links || {};
  const theme = data.theme || {};

  // Build social icons HTML
  const socialHtml = `
    ${social.instagram ? `<a href="${social.instagram}" target="_blank"><i class="fab fa-instagram"></i></a>` : ''}
    ${social.youtube ? `<a href="${social.youtube}" target="_blank"><i class="fab fa-youtube"></i></a>` : ''}
    ${social.soundcloud ? `<a href="${social.soundcloud}" target="_blank"><i class="fab fa-soundcloud"></i></a>` : ''}
    ${social.spotify ? `<a href="${social.spotify}" target="_blank"><i class="fab fa-spotify"></i></a>` : ''}
    ${social.email ? `<a href="mailto:${social.email}"><i class="fas fa-envelope"></i></a>` : ''}
  `;

  // Build navigation links
  const navHtml = sections.map((section, idx) => {
    const label = section.title || 'Untitled';
    return `<a href="#section-${idx}">${label}</a>`;
  }).join('');

  // Build sections HTML
  const sectionsHtml = sections.map((section, idx) => {
    let contentHtml = '';
    if (section.type === 'bio') {
      contentHtml = marked(section.body || '');
    } else if (section.type === 'video_reel') {
      const videos = section.videos || [];
      contentHtml = `
        <h2 class="section-title">${section.title}</h2>
        <div class="video-grid">
          ${videos.map(v => `
            <div class="video-item">
              <iframe src="${v.url}" frameborder="0" allowfullscreen></iframe>
              ${v.caption ? `<div class="caption">${v.caption}</div>` : ''}
            </div>
          `).join('')}
        </div>
      `;
    } else if (section.type === 'music') {
      const tracks = section.tracks || [];
      contentHtml = `
        <h2 class="section-title">${section.title}</h2>
        <div class="audio-grid">
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
      contentHtml = `
        <h2 class="section-title">${section.title}</h2>
        <div class="audio-grid">
          ${tracks.map(t => `
            <div class="audio-item">
              <iframe src="${t.url}" frameborder="0" scrolling="no"></iframe>
              ${t.caption ? `<div class="caption">${t.caption}</div>` : ''}
            </div>
          `).join('')}
        </div>
      `;
    } else if (section.type === 'contact') {
      contentHtml = `
        <h2 class="section-title">${section.title}</h2>
        ${section.text ? marked(section.text) : '<p>Contact me via the social links above.</p>'}
      `;
    }
    return `<section class="section ${section.type}" id="section-${idx}">${contentHtml}</section>`;
  }).join('');

  // CSS (same as live site, with theme variables)
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
    }
    .container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 2rem 2rem 6rem;
    }
    .section {
      margin-bottom: 6rem;
      scroll-margin-top: 100px;
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
    .video_reel .video-item iframe {
      width: 100%;
      aspect-ratio: 16 / 9;
      border: none;
    }
    .music .audio-grid, .sound_design .audio-grid {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      margin-top: 1.5rem;
    }
    .music iframe, .sound_design iframe {
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
      .social-icons { margin-left: 0; justify-content: center; }
      .bio p { max-width: 100%; }
      .bio h1 { font-size: calc(var(--heading-size) * 0.7); }
      .video-grid { grid-template-columns: 1fr; }
    }
  `;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Inter:wght@300;400;500&family=Playfair+Display:wght@400;500&family=Open+Sans:wght@300;400&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
        <style>${css}</style>
      </head>
      <body>
        <header class="site-header">
          <div class="site-title">${siteName}</div>
          <div class="nav-links">${navHtml}</div>
          <div class="social-icons">${socialHtml}</div>
        </header>
        <main class="container">
          ${sectionsHtml}
        </main>
      </body>
    </html>
  `;
});
