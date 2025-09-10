import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Navbar } from "../src/components/navbar/Navbar";
import { Button } from "../src/components/button/Button";

const items = [
  { label: "Home", href: "#", active: true },
  {
    label: "Products",
    children: [
      { label: "Launchpad", href: "#", description: "CI/CD for design systems" },
      { label: "Telemetry", href: "#", description: "Usage analytics & insights" },
      { label: "Workbench", href: "#", description: "Component playground" },
    ],
  },
  {
    label: "Docs",
    children: [
      { label: "Getting started", href: "#" },
      { label: "Theming", href: "#" },
      { label: "Accessibility", href: "#" },
      { label: "Changelog", href: "#" },
    ],
  },
  { label: "Pricing", href: "#" },
];

const meta: Meta = { title: "Navigation/Navbar (Dropdowns)" };
export default meta;

export const Dropdowns: StoryObj = {
  render: () => (
    <div style={{ minHeight: "150vh", background: "linear-gradient(180deg,#f8fafc,#eef2ff)" }}>
      <Navbar
        brand={<b>AstronautUI</b>}
        items={items}
        actions={<Button size="sm" variant="primary">Get started</Button>}
        forceDesktop
      />
      <main style={{ padding: 16 }}>
        <p>Hover/click “Products” or “Docs”. Forced desktop mode for Storybook.</p>
      </main>
    </div>
  ),
};
