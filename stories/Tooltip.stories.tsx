/* @ts-nocheck */
import React from "react";
import { Tooltip } from "../src/components/tooltip/Tooltip";
import { Button } from "../src/components/button/Button";

export default { title: "Overlay/Tooltip" };

export const Basic = () => (
  <div style={{ display: "flex", gap: 16, alignItems: "center", padding: 24 }}>
    <Tooltip content="Top tip (default)">
      <Button>Hover me (Top)</Button>
    </Tooltip>
    <Tooltip placement="bottom" content="Sits below">
      <Button>Bottom</Button>
    </Tooltip>
    <Tooltip placement="left" content="On the left">
      <Button>Left</Button>
    </Tooltip>
    <Tooltip placement="right" content="On the right">
      <Button>Right</Button>
    </Tooltip>
  </div>
);

export const LongContent = () => (
  <div style={{ padding: 24 }}>
    <Tooltip placement="top" content="This is a longer tooltip that wraps onto multiple lines to demonstrate max-width and readable spacing.">
      <Button>Long tooltip</Button>
    </Tooltip>
  </div>
);
