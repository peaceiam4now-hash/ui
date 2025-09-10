import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Card } from "../src/components/card/Card";

const meta: Meta<typeof Card> = {
  title: "AstronautUI/Card",
  component: Card,
};
export default meta;

type Story = StoryObj<typeof Card>;

export const Elevated: Story = {
  render: () => (
    <Card>
      <h3>Elevated Card</h3>
      <p>This is a card with elevation (shadow).</p>
    </Card>
  ),
};

export const Outline: Story = {
  render: () => (
    <Card variant="outline">
      <h3>Outline Card</h3>
      <p>This is a card with a border outline.</p>
    </Card>
  ),
};
