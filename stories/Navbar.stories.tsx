import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta = {
  title: 'Navigation/Navbar',
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj;

export const Basic: Story = {
  render: () => (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        borderBottom: '1px solid #e5e7eb',
        position: 'sticky',
        top: 0,
        background: 'var(--aui-color-surface, #fff)',
      }}
    >
      <div style={{ fontWeight: 600 }}>AstronautUI</div>
      <nav style={{ display: 'flex', gap: 12 }}>
        <a href="#" style={{ textDecoration: 'none' }}>Docs</a>
        <a href="#" style={{ textDecoration: 'none' }}>Components</a>
        <a href="#" style={{ textDecoration: 'none' }}>GitHub</a>
      </nav>
    </header>
  ),
};
