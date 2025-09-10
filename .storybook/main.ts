import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../stories/**/*.stories.@(ts|tsx|js|jsx)"],
  addons: ["@storybook/addon-essentials"],
  framework: { name: "@storybook/react-vite", options: {} },
  docs: { autodocs: false },
  typescript: { reactDocgen: false },
  viteFinal: async (config) => {
    // Polyfill process.env for any deps that expect it
    config.define = {
      ...(config.define ?? {}),
      "process.env": {},
      "process.env.NODE_ENV": JSON.stringify("development"),
    };
    // Calm the overlay (avoid reload loops on overlay errors)
    config.server = {
      ...(config.server ?? {}),
      hmr: { ...(config.server?.hmr ?? {}), overlay: false },
    };
    // Disable React fast-refresh (common reload culprit)
    const reactPlugin = (config.plugins || []).find(
      // Vite React plugin names vary: vite:react-babel / @vitejs/plugin-react
      (p: any) => p?.name?.startsWith?.("vite:react")
    ) as any;
    if (reactPlugin?.api?.options) {
      reactPlugin.api.options.fastRefresh = false;
    }
    return config;
  },
};
export default config;
