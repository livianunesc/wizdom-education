import { duoMiddleware } from './server/duo.mjs';
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";
import { fileURLToPath } from "node:url";
import { createReadStream, statSync } from "node:fs";
import { join } from "node:path";

// The ready-to-open package keeps the PDF library beside index.html.
// Expose that same library during Vite development/preview without duplicating it.
function examLibrary() {
  const directory = fileURLToPath(new URL("./provas/enem/", import.meta.url));
  function serve(req, res, next) {
    const path = (req.url || "").split("?")[0];
    if (!path.startsWith("/provas/enem/")) return next();
    const match = /^\/provas\/enem\/([A-Za-z0-9_.-]+\.pdf)$/.exec(path);
    if (!match || !["GET", "HEAD"].includes(req.method)) {
      res.statusCode = 404; return res.end("PDF não encontrado");
    }
    const file = join(directory, match[1]);
    try {
      const stat = statSync(file);
      if (!stat.isFile()) throw new Error("not a file");
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Length", stat.size);
      res.setHeader("Content-Disposition", `inline; filename="${match[1]}"`);
      if (req.method === "HEAD") return res.end();
      const stream = createReadStream(file);
      stream.on("error", () => { if (!res.headersSent) res.statusCode = 500; res.end(); });
      stream.pipe(res);
    } catch { res.statusCode = 404; res.end("PDF não encontrado"); }
  }
  return {
    name: "wizdom-local-exam-library",
    configureServer(server) { server.middlewares.use(serve); },
    configurePreviewServer(server) { server.middlewares.use(serve); },
  };
}

export default defineConfig({
  // Keep the development entry separate from the ready-to-open root index.html.
  root: fileURLToPath(new URL("./web", import.meta.url)),
  publicDir: false,
  plugins: [examLibrary(), {
    name: 'wizdom-duo',
    configureServer(server) { server.middlewares.use(duoMiddleware()); },
    configurePreviewServer(server) { server.middlewares.use(duoMiddleware()); },
  }, react(), viteSingleFile({ removeViteModuleLoader: true })],
  build: {
    outDir: fileURLToPath(new URL("./dist", import.meta.url)),
    emptyOutDir: true,
    assetsInlineLimit: () => true,
  },
});
