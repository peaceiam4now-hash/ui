import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Radio, RadioGroup } from "./Radio";

const meta: Meta<typeof Radio> = {
  title: "Form/Radio",
  component: Radio,
};
export default meta;
type Story = StoryObj<typeof Radio>;

export const Basic: Story = {
  render: () => (
    <RadioGroup defaultValue="b">
      <Radio value="a" label="Option A" />
      <Radio value="b" label="Option B" description="This is preselected." />
      <Radio value="c" label="Option C" />
    </RadioGroup>
  ),
};

export const ControlledGroup: Story = {
  render: () => {
    const [val, setVal] = useState("x");
    return (
      <RadioGroup value={val} onValueChange={setVal} orientation="horizontal">
        <Radio value="x" label="X" />
        <Radio value="y" label="Y" />
        <Radio value="z" label="Z" />
      </RadioGroup>
    );
  },
};
