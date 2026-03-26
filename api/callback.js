export default async function handler(req, res) {
  const { code } = req.query;
  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });
  const data = await response.json();

  // This is the part that tells the dashboard "Success!"
  const payload = JSON.stringify({
    token: data.access_token,
    provider: "github"
  });

  res.send(`
    <html><body><script>
      (function() {
        window.opener.postMessage('authorization:github:success:${payload}', '*');
      })()
    </script></body></html>
  `);
}
