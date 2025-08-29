export default function handler(req, res) {
  res.json({ headers: req.headers });
}
