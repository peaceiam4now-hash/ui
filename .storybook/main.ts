// .storybook/main.ts
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(tsx|mdx)', '../stories/**/*.mdx'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y', // SB 8-compatible version installed
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  // Prevent HMR loops by ignoring log/artifact paths
  viteFinal: async (cfg) => {
    cfg.server ??= {};
    cfg.server.watch ??= {};
    const ignored = cfg.server.watch.ignored ?? [];
    cfg.server.watch.ignored = Array.from(
      new Set([
        ...ignored,
        '**/.logs/**',
        '**/storybook-static/**',
        '**/.cache/**',
        '**/.playwright/**',
        '**/.tmp/**',
      ])
    );
    return cfg;
  },
};

export default config;
