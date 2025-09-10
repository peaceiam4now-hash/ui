import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
const meta: Meta = { title: 'Debug/00-Minimal' };
export default meta;
export const Box: StoryObj = { render: () => <div style={{padding:16, background:'#eee'}}>Minimal story OK</div> };
