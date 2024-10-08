import * as child_process from "node:child_process";
import * as path from "node:path";
import {fileURLToPath} from "url";
import generateIcon from "icon-gen";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const original_icons = path.join(__dirname, "Logo.png");
const icons = path.join(__dirname, "src-tauri", "icons");
const sizes = [16, 32, 64, 128, 256, 512];
const ffmpeg = path.join(__dirname, "node_modules", "ffmpeg-static", "ffmpeg");
sizes.forEach((size) =>
              {
                  child_process.execSync(`${ffmpeg} -y -i ${original_icons} -vf \"scale=${size}:${size}\" ${path.join(icons, `${size}x${size}.png`)}`);
              });
generateIcon(original_icons, icons, {
    report: true,
    ico: {sizes: [16, 32, 48, 64, 128, 256, 512], name: "icon"},
    icns: {sizes: [16, 32, 48, 64, 128, 256, 512], name: "icon"}
})
    .catch((error) =>
           {
               console.error("Failed to generate icon.", error);
           });

