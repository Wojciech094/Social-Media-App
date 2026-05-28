import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // We need to simulate the DOM for some tests
    environment: "jsdom",
  },
});
