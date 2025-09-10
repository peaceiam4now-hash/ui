import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Navbar } from "../src/components/navbar/Navbar";
import { Button } from "../src/components/button/Button";
import { Input } from "../src/components/input/Input";

const items = [
  { label: "Home", href: "#", active: true },
  { label: "Products", href: "#" },
  { label: "Pricing", href: "#" },
  { label: "Docs", href: "#" },
];

const Actions = () => (
  <div style={{ display: "flex", gap: 8 }}>
    <Input placeholder="Search…" style={{ width: 180 }} aria-label="Search" />
    <Button size="sm">Sign in</Button>
    <Button size="sm" variant="primary">Get started</Button>
  </div>
);

const meta: Meta = { title: "Navigation/Navbar" };
export default meta;

export const Basic: StoryObj = {
  render: () => (
    <div style={{ minHeight: "150vh", background: "linear-gradient(180deg,#f8fafc,#eef2ff)" }}>
      <Navbar brand={<b>AstronautUI</b>} items={items} actions={<Actions/>} />
      <main style={{ padding: 16 }}>
        <p>Scroll to see the elevate-on-scroll shadow.</p>
      </main>
    </div>
  )
};

export const DarkTransparentOverHero: StoryObj = {
  render: () => (
    <div style={{ minHeight: "150vh", background: "url('https://picsum.photos/seed/space/1600/900') center/cover no-repeat" }}>
      <Navbar
        brand={<b style={{ letterSpacing: ".5px" }}>AstronautUI</b>}
        items={items}
        actions={<Button size="sm" variant="primary">Launch</Button>}
        colorScheme="dark"
        transparent
        position="fixed"
      />
      <main style={{ paddingTop: 100, color: "white", textShadow: "0 2px 8px rgba(0,0,0,.5)" }}>
        <h1>Hero Section</h1>
        <p>Navbar overlays this background and uses dark scheme.</p>
      </main>
    </div>
  )
};

export const CompactContainerAndSticky: StoryObj = {
  render: () => (
    <div style={{ minHeight: "150vh" }}>
      <Navbar
        brand={<div style={{display:"flex",alignItems:"center",gap:8}}><span>🚀</span><b>AstronautUI</b></div>}
        items={[{label:"Dashboard",href:"#",active:true},{label:"Team",href:"#"}, {label:"Projects",href:"#"}]}
        actions={<Button size="sm">Invite</Button>}
        containerWidth={960}
        position="sticky"
      />
      <div style={{ padding: 16 }}>
        <p>Container width limited to 960px.</p>
      </div>
    </div>
  )
};
