import type { Meta, StoryObj } from "@storybook/react";
import { Switch } from "../src/components/switch/Switch";
const meta: Meta<typeof Switch> = { title: "Core/Switch", component: Switch };
export default meta;
export const Default: StoryObj<typeof Switch> = { args: { label: "Notifications" } };
