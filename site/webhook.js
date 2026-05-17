const express = require("express");
const { exec } = require("child_process");
const crypto = require("crypto");

const app = express();
app.use(express.json());

const SECRET = "monsecretwebhook";

function verify(req) {
  const sig = req.headers["x-hub-signature-256"];
  if (!sig) return false;

  const hmac = crypto.createHmac("sha256", SECRET);
  const digest = "sha256=" + hmac.update(JSON.stringify(req.body)).digest("hex");

  return sig === digest;
}

app.post("/webhook", (req, res) => {
  if (!verify(req)) return res.status(401).send("bad signature");

  console.log("Webhook reçu → git pull");
  
  exec("git pull origin main && pm2 restart mini-site", { cwd: "C:\\Users\\max_r\\Documents\\mini-site" }, (err, out) => {
    console.log(out);
  });
});

app.listen(3000, () => console.log("Webhook listening"));