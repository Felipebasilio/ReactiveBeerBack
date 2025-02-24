import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { json } from "./middlewares/json.js";
import { routes } from "./routes.js";
import { extractQueryParams } from "./utils/extract-query-params.js";

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  // 🔥 Adiciona os cabeçalhos CORS em TODAS as respostas 🔥
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // 🔥 Responde rapidamente às requisições OPTIONS 🔥
  if (method === "OPTIONS") {
    res.writeHead(204).end();
    return;
  }

  // Servindo arquivos estáticos da pasta public/
  if (url.startsWith("/public/")) {
    const filePath = path.join(process.cwd(), url);
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("File not found");
      } else {
        const ext = path.extname(filePath);
        const contentType =
          ext === ".png"
            ? "image/png"
            : ext === ".jpg" || ext === ".jpeg"
            ? "image/jpeg"
            : "application/octet-stream";
        res.writeHead(200, { "Content-Type": contentType });
        res.end(data);
      }
    });
    return;
  }

  await json(req, res);

  const route = routes.find(
    (route) => route.method === method && route.path.test(url)
  );

  if (route) {
    const routeParams = req.url.match(route.path);
    const { query, ...params } = routeParams.groups;

    req.params = params;
    req.query = query ? extractQueryParams(query) : {};

    return route.handler(req, res);
  }

  return res.writeHead(404).end(JSON.stringify({ error: "Not Found" }));
});

server.listen(3333, () => {
  console.log("🔥 Server running on http://localhost:3333");
});
