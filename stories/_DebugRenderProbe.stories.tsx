import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Card } from "../src/components/card/Card";

const meta: Meta = { title: "Debug/RenderProbe" };
export default meta;

export const CanvasAndCard: StoryObj = {
  render: () => (
    <div style={{ display: "grid", gap: 16, padding: 16, background: "#f0f0f0" }}>
      <div style={{ height: 120, background: "red", color: "white", display: "grid", placeItems: "center" }}>
        If you can see this RED BOX, Storybook canvas is fine.
      </div>
      <Card>
        <h3>Card inside RenderProbe</h3>
        <p>This should be visible. If not, CSS or render path is the issue.</p>
      </Card>
    </div>
  )
};
