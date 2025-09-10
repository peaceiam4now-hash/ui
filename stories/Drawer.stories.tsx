/* @ts-nocheck */
import React, { useState } from "react";
import { Drawer, DrawerLayout } from "../src/components/drawer/Drawer";
import { Button } from "../src/components/button/Button";

export default { title: "Navigation/Drawer" };

export const OverlayLeft = () => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ minHeight: "120vh", background: "linear-gradient(180deg,#f8fafc,#eef2ff)", padding: 16 }}>
      <Button onClick={() => setOpen(true)}>Open Drawer (Left)</Button>
      <p style={{ marginTop: 12 }}>Esc or click overlay to close.</p>
      <Drawer open={open} onOpenChange={setOpen} side="left" title="Navigation">
        <nav style={{ display: "grid", gap: 8 }}>
          <a href="#" style={{ textDecoration: "none" }}>Dashboard</a>
          <a href="#" style={{ textDecoration: "none" }}>Projects</a>
          <a href="#" style={{ textDecoration: "none" }}>Reports</a>
          <a href="#" style={{ textDecoration: "none" }}>Settings</a>
        </nav>
      </Drawer>
    </div>
  );
};

export const OverlayRight = () => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ minHeight: "120vh", background: "linear-gradient(180deg,#fff7ed,#fde68a)", padding: 16 }}>
      <Button onClick={() => setOpen(true)}>Open Drawer (Right)</Button>
      <Drawer open={open} onOpenChange={setOpen} side="right" title="Filters">
        <div style={{ display: "grid", gap: 8 }}>
          <label><input type="checkbox" /> Show archived</label>
          <label><input type="checkbox" /> Include drafts</label>
          <label><input type="checkbox" /> Only favorites</label>
        </div>
      </Drawer>
    </div>
  );
};

export const PushLayout = () => {
  const [open, setOpen] = useState(true);
  return (
    <DrawerLayout open={open} side="left" width={280}>
      <div style={{ padding: 16 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Button onClick={() => setOpen(o => !o)}>{open ? "Close" : "Open"} Sidebar</Button>
          <span>Content shifts when sidebar is open.</span>
        </div>

        <Drawer open={open} onOpenChange={setOpen} side="left" width={280} title="Project Menu">
          <ul style={{ padding: 0, margin: 0, listStyle: "none", display: "grid", gap: 6 }}>
            <li><a href="#">Overview</a></li>
            <li><a href="#">Issues</a></li>
            <li><a href="#">Releases</a></li>
            <li><a href="#">Integrations</a></li>
          </ul>
        </Drawer>

        <main style={{ minHeight: "100vh" }}>
          <h2>Dashboard</h2>
          <p>This area gets padded on the left when the drawer is open, thanks to DrawerLayout.</p>
        </main>
      </div>
    </DrawerLayout>
  );
};
