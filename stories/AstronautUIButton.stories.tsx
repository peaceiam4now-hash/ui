import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Button } from "../src/components/button/Button";

const meta: Meta<typeof Button> = {
  title: "AstronautUI/Button",
  component: Button,
  args: {
    children: "Click Me",
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["solid", "ghost", "link"],
    },
    disabled: { control: "boolean" },
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Solid: Story = {
  args: { variant: "solid" },
};

export const Ghost: Story = {
  args: { variant: "ghost" },
};

export const Link: Story = {
  args: { variant: "link" },
};

export const Disabled: Story = {
  args: { disabled: true },
};
