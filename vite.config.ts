import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import {TreeshakingOptions} from "rollup";

// https://vitejs.dev/config/
export default defineConfig(async () => ({
    plugins: [react()],
    // esbuild: {legalComments: "none"},

    // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
    //
    // 1. prevent vite from obscuring rust errors
    clearScreen: false,
    // 2. tauri expects a fixed port, fail if that port is not available
    server: {
        port: 1420,
        strictPort: true,
        watch: {
            // 3. tell vite to ignore watching `src-tauri`
            ignored: ["**/src-tauri/**"]
        }
    },
    esbuild: {
        supported: {
            "top-level-await": true //browsers can handle top-level-await features
        }
    },
    build: {
        rollupOptions: {
            input: {
                app: "index.html",
                logview: "log-window.html"
            },
            treeshake: ({
                preset: "recommended",
                tryCatchDeoptimization: true,
            } as TreeshakingOptions),
            shimMissingExports: true

        }
    }
}));
