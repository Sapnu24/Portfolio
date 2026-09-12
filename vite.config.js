import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from "fs";

function saveProjectImagePlugin() {
  return {
    name: "save-project-image-plugin",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === "/api/save-project-image" && req.method === "POST") {
          const chunks = [];
          req.on("data", (chunk) => chunks.push(chunk));
          req.on("end", () => {
            try {
              const buffer = Buffer.concat(chunks);
              const rawFileName = req.headers["x-filename"] || `project_${Date.now()}.png`;
              const cleanFileName = decodeURIComponent(rawFileName).replace(/[^a-zA-Z0-9._-]/g, "_");
              const targetDir = path.resolve(__dirname, "public/img/projects");
              if (!fs.existsSync(targetDir)) {
                fs.mkdirSync(targetDir, { recursive: true });
              }
              const targetFilePath = path.join(targetDir, cleanFileName);
              fs.writeFileSync(targetFilePath, buffer);

              res.setHeader("Content-Type", "application/json");
              res.statusCode = 200;
              res.end(
                JSON.stringify({
                  success: true,
                  path: `/img/projects/${cleanFileName}`,
                })
              );
            } catch (err) {
              res.setHeader("Content-Type", "application/json");
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), saveProjectImagePlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
