// .storybook/main.ts
import type { StorybookConfig } from '@storybook/react-vite'; // or your framework

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(tsx|mdx)', '../stories/**/*.mdx'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',   // ✅ make sure this is present
  ],
  framework: {
    name: '@storybook/react-vite', // or your framework
    options: {},
  },
};
export default config;

