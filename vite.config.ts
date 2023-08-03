import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vite.test.setup.ts", "./vite.mock.setup.ts"],
    reporters: ["verbose"],
    root: "./",
    globals: false,
  },
});
