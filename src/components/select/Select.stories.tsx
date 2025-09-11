import type { Meta, StoryObj } from "@storybook/react";
import { Select } from "./Select";

const meta: Meta<typeof Select> = {
  title: "Form/Select",
  component: Select,
};
export default meta;
type Story = StoryObj<typeof Select>;

export const Basic: Story = {
  render: () => (
    <Select defaultValue="">
      <option value="" disabled>Choose a country</option>
      <option>United States</option>
      <option>Canada</option>
      <option>Germany</option>
    </Select>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 12 }}>
      <Select size="sm"><option>Small</option></Select>
      <Select size="md"><option>Medium</option></Select>
      <Select size="lg"><option>Large</option></Select>
    </div>
  ),
};
