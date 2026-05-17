const express = require("express");
const { exec } = require("child_process");
const crypto = require("crypto");

const app = express();

app.use(express.json());

// Serveur web normal
app.use(express.static("public"));

// --- WEBHOOK GITHUB ---
const SECRET = "monsecretwebhook"; // à choisir

function verifySignature(req) {
  const signature = req.headers["x-hub-signature-256"];
  const body = JSON.stringify(req.body);

  const hmac = crypto.createHmac("sha256", SECRET);
  const digest = "sha256=" + hmac.update(body).digest("hex");

  return signature === digest;
}

app.post("/webhook", (req, res) => {
  if (!verifySignature(req)) {
    return res.status(401).send("Unauthorized");
  }

  console.log("Webhook reçu, pull du repo...");

  exec("git pull origin main", { cwd: "C:\\site" }, (err, stdout) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Erreur deploy");
    }

    console.log(stdout);
    res.send("OK deploy");
  });
});

// serveur
app.listen(80, () => {
  console.log("Site + webhook actif sur port 80");
});