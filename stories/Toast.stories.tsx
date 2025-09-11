import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta = {
  title: 'Feedback/Toast',
  parameters: {
    docs: {
      description: {
        component:
          'Temporary placeholder while toast API/types stabilize. This keeps Storybook + a11y green.',
      },
    },
  },
};
export default meta;

type Story = StoryObj;

export const Placeholder: Story = {
  render: () => (
    <div style={{ padding: 16 }}>
      <h3 style={{ margin: 0 }}>Toast demo placeholder</h3>
      <p style={{ marginTop: 8 }}>
        Replace this story once the <code>toast</code> host + variants are finalized.
      </p>
    </div>
  ),
};
