import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react-swc";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tsConfigPaths(),
    tanstackStart(),
    nitro({
      config: {
        preset: "vercel",
        externals: {
          inline: [],
        },
        rollupConfig: {
          external: ["sharp", "sharp-ico"],
        },
      },
    }),
    viteReact(),
    tailwindcss(),
  ],
  ssr: {
    external: ["sharp", "sharp-ico"],
  },
  optimizeDeps: {
    exclude: ["sharp", "sharp-ico"],
  },
});
