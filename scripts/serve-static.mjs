import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { createReadStream, existsSync } from "node:fs";
import { extname, join, normalize } from "node:path";

const root = join(process.cwd(), "out");
const port = Number(process.env.PORT || 3004);

const types = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp"
};

function safePath(url) {
  const pathname = decodeURIComponent(new URL(url, `http://localhost:${port}`).pathname);
  const clean = normalize(pathname).replace(/^(\.\.[/\\])+/, "");
  return join(root, clean === "/" ? "index.html" : clean);
}

createServer(async (request, response) => {
  const filePath = safePath(request.url || "/");
  const target = existsSync(filePath) ? filePath : join(root, "index.html");
  const type = types[extname(target)] || "application/octet-stream";

  try {
    response.writeHead(200, { "Content-Type": type });
    createReadStream(target).pipe(response);
  } catch {
    response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    response.end(await readFile(join(root, "index.html"), "utf8"));
  }
}).listen(port, "localhost", () => {
  console.log(`17-0 static preview: http://localhost:${port}`);
});
