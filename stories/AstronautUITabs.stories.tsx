import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Tabs } from "../src/components/tabs/Tabs";

const meta: Meta<typeof Tabs> = {
  title: "AstronautUI/Tabs",
  component: Tabs,
};
export default meta;

type Story = StoryObj<typeof Tabs>;

const sampleTabs = [
  { id: "one", label: "Tab One", content: <p>Content for Tab One</p> },
  { id: "two", label: "Tab Two", content: <p>Content for Tab Two</p> },
  { id: "three", label: "Tab Three", content: <p>Content for Tab Three</p> },
];

export const Default: Story = {
  render: () => <Tabs tabs={sampleTabs} />,
};
