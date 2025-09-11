// .storybook/preview.ts
import type { Preview } from '@storybook/react';

const preview: Preview = {
  parameters: {
    a11y: {
      // Keep it simple: scan the #storybook-root
      element: '#storybook-root',
    },
  },
};

export default preview;
