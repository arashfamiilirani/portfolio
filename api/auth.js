export default async function handler(req, res) {
  const url = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=repo,user`;
  res.redirect(url);
}
