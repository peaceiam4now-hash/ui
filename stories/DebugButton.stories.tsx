import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Button } from "../src/components/button/Button";

const meta: Meta<typeof Button> = {
  title: "Debug/Button",
  component: Button,
};
export default meta;

export const Primary: StoryObj<typeof Button> = {
  args: {
    children: "Click Me",
  },
};
