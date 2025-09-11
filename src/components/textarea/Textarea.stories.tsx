import type { Meta, StoryObj } from "@storybook/react";
import { Textarea } from "./Textarea";

const meta: Meta<typeof Textarea> = {
  title: "Form/Textarea",
  component: Textarea,
};
export default meta;
type Story = StoryObj<typeof Textarea>;

export const Basic: Story = { render: () => <Textarea placeholder="Write your message…" /> };
export const WithCount: Story = { render: () => <Textarea placeholder="Bio" maxLength={160} showCount /> };
export const Sizes: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 12 }}>
      <Textarea size="sm" placeholder="Small" />
      <Textarea size="md" placeholder="Medium" />
      <Textarea size="lg" placeholder="Large" />
    </div>
  ),
};
