import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { chromium } from "playwright";

const siteDir = "_site";
const outDir = "output";

const contentType = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".woff": "font/woff",
  ".woff2": "font/woff2"
};

function mapUrlToFile(urlPathname) {
  const cleaned = decodeURIComponent(urlPathname.split("?")[0]);
  const safePath = normalize(cleaned).replace(/^\.+/, "");
  let localPath = join(siteDir, safePath);

  if (safePath === "/" || safePath === "") {
    localPath = join(siteDir, "index.html");
  }

  if (!extname(localPath)) {
    localPath = join(localPath, "index.html");
  }

  return localPath;
}

const server = createServer(async (req, res) => {
  try {
    const localPath = mapUrlToFile(req.url || "/");
    const body = await readFile(localPath);
    const ext = extname(localPath).toLowerCase();

    res.writeHead(200, { "content-type": contentType[ext] || "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("Not found");
  }
});

server.listen(4173, "127.0.0.1", async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

const targets = [
    {
      url: "http://127.0.0.1:4173/",
      files: [`${outDir}/highlights.pdf`, `${siteDir}/assets/highlights.pdf`]
    },
    {
      url: "http://127.0.0.1:4173/complete/",
      files: [`${outDir}/complete.pdf`, `${siteDir}/assets/complete.pdf`]
    }
  ];

  for (const target of targets) {
    await page.goto(target.url, { waitUntil: "networkidle" });
    for (const file of target.files) {
      await page.pdf({
        path: file,
        format: "A4",
        printBackground: true,
        margin: {
          top: "0.4in",
          right: "0.45in",
          bottom: "0.45in",
          left: "0.45in"
        }
      });
    }
  }

  await browser.close();
  server.close();
});
