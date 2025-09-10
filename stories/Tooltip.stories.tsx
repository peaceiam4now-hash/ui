import type { Meta, StoryObj } from "@storybook/react";
import { Tooltip } from "../src/components/tooltip/Tooltip";
import { Button } from "../src/components/button/Button";

const meta: Meta<typeof Tooltip> = { title: "Core/Tooltip", component: Tooltip };
export default meta;
export const Basic: StoryObj<typeof Tooltip> = {
  render: () => (
    <Tooltip label="Copy to clipboard">
      <Button variant="ghost">Hover or focus me</Button>
    </Tooltip>
  )
};
