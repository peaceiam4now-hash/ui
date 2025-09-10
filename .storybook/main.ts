import type { StorybookConfig } from "@storybook/react-vite";

const inCodespaces = !!process.env.CODESPACES || !!process.env.CODESPACE_NAME;

const config: StorybookConfig = {
  stories: ["../stories/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-essentials"], // keep interactions off for now
  framework: { name: "@storybook/react-vite", options: {} },
  viteFinal: async (cfg) => {
    cfg.server = cfg.server || {};
    // Ignore folders that can thrash the watcher
    cfg.server.watch = {
      ...(cfg.server.watch || {}),
      ignored: ['**/.git/**','**/node_modules/**','**/.cache/**','**/.vite/**','**/tools/**','**/storybook-static/**'],
    };
    // Fix HMR socket in Codespaces (https reverse proxy)
    if (inCodespaces) {
      cfg.server.hmr = {
        ...(cfg.server.hmr || {}),
        protocol: 'wss',
        clientPort: 443
      };
    }
    return cfg;
  },
};
export default config;
