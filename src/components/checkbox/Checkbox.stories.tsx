import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Checkbox } from "./Checkbox";

const meta: Meta<typeof Checkbox> = {
  title: "Form/Checkbox",
  component: Checkbox,
};
export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Basic: Story = {
  render: () => <Checkbox label="Accept terms" description="You can revoke at any time." defaultChecked />,
};

export const Controlled: Story = {
  render: () => {
    const [v, setV] = useState(false);
    return <Checkbox label="Email me updates" checked={v} onChange={setV} />;
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 12 }}>
      <Checkbox size="sm" label="Small" />
      <Checkbox size="md" label="Medium" />
      <Checkbox size="lg" label="Large" />
    </div>
  ),
};

export const Indeterminate: Story = {
  render: () => <Checkbox label="Parent selection" indeterminate />,
};
