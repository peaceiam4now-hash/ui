import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Navbar, type NavItem } from "../src/components/navbar/Navbar";
import { Button } from "../src/components/button/Button";

const products: NavItem = {
  label: "Products",
  mega: true,
  columns: 3,
  children: [
    {
      title: "Build",
      items: [
        { label: <>🚀 Launchpad</>, href: "#", description: "CI/CD for design systems" },
        { label: <>🧪 Workbench</>, href: "#", description: "Component playground" },
        { label: <>⚙️ Pipelines</>, href: "#", description: "Automations & tasks" },
      ],
    },
    {
      title: "Ship",
      items: [
        { label: <>📦 Registry</>, href: "#", description: "Versioned packages" },
        { label: <>📜 Docs</>, href: "#", description: "Markdown & MDX hosting" },
        { label: <>🛰 CDN</>, href: "#", description: "Global asset delivery" },
      ],
    },
    {
      title: "Measure",
      items: [
        { label: <>📈 Telemetry</>, href: "#", description: "Usage analytics & insights" },
        { label: <>🧭 Experiments</>, href: "#", description: "A/B & feature flags" },
        { label: <>🔎 Quality</>, href: "#", description: "Visual & a11y regressions" },
      ],
    },
  ],
};

const resources: NavItem = {
  label: "Resources",
  mega: true,
  columns: 2,
  children: [
    {
      title: "Developers",
      items: [
        { label: "API Reference", href: "#" },
        { label: "SDKs", href: "#" },
        { label: "Starter Templates", href: "#" },
        { label: "Changelog", href: "#" },
      ],
    },
    {
      title: "Guides",
      items: [
        { label: "Theming", href: "#" },
        { label: "Accessibility", href: "#" },
        { label: "Performance", href: "#" },
        { label: "Deployment", href: "#" },
      ],
    },
  ],
};

const items: NavItem[] = [
  { label: "Home", href: "#", active: true },
  products,
  resources,
  { label: "Pricing", href: "#" },
];

const meta: Meta = { title: "Navigation/Navbar (Mega Menu)" };
export default meta;

export const MegaMenu: StoryObj = {
  render: () => (
    <div style={{ minHeight: "150vh", background: "linear-gradient(180deg,#f8fafc,#eef2ff)" }}>
      <Navbar
        brand={<b>AstronautUI</b>}
        items={items}
        actions={<Button size="sm" variant="primary">Get started</Button>}
        forceDesktop
      />
      <main style={{ padding: 16 }}>
        <p>Hover/click “Products” or “Resources”. Forced desktop mode for Storybook.</p>
      </main>
    </div>
  ),
};
