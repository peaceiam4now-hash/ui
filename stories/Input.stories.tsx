import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "../src/components/input/Input";
const meta: Meta<typeof Input> = { title: "Core/Input", component: Input };
export default meta;
export const Basic: StoryObj<typeof Input> = { args: { label: "Email", placeholder: "you@domain.com" } };
export const Error: StoryObj<typeof Input> = { args: { label: "Email", placeholder: "you@domain.com", error: "Invalid email" } };
