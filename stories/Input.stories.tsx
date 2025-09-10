import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "../src/components/input/Input";
import * as React from "react";

const meta: Meta<typeof Input> = {
  title: "Core/Input",
  component: Input,
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    fullWidth: { control: "boolean" },
    revealPasswordToggle: { control: "boolean" }
  }
};
export default meta;

type Story = StoryObj<typeof Input>;

export const Basic: Story = { args: { label: "Email", placeholder: "you@domain.com" } };
export const WithPrefix: Story = { args: { label: "Search", placeholder: "Type to search", prefix: "🔍" } };
export const WithSuffix: Story = { args: { label: "Amount", placeholder: "0.00", suffix: "USD" } };
export const Error: Story = { args: { label: "Email", placeholder: "you@domain.com", error: "Invalid email address" } };
export const Hint: Story = { args: { label: "Username", placeholder: "yourname", hint: "3–20 characters, letters & numbers" } };
export const Sizes: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "0.75rem", maxWidth: 360 }}>
      <Input label="Small" size="sm" placeholder="Small" />
      <Input label="Medium" size="md" placeholder="Medium" />
      <Input label="Large" size="lg" placeholder="Large" />
    </div>
  )
};
export const PasswordReveal: Story = {
  args: { label: "Password", type: "password", placeholder: "••••••••", revealPasswordToggle: true }
};
export const FullWidth: Story = { args: { label: "Full name", placeholder: "John Appleseed", fullWidth: true } };
