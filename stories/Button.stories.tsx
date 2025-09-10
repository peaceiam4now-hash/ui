import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../src/components/button/Button";

const meta: Meta<typeof Button> = {
  title: "Core/Button",
  component: Button
};
export default meta;
export const Solid: StoryObj<typeof Button> = { args: { children: "Primary" } };
export const Ghost: StoryObj<typeof Button> = { args: { children: "Ghost", variant: "ghost" } };
export const Link: StoryObj<typeof Button> = { args: { children: "Link", variant: "link" } };
