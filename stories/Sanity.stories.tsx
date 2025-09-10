import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

const meta: Meta = { title: "Sanity/Hello" };
export default meta;

export const Hello: StoryObj = {
  render: () => (
    <div style={{ padding: 16, border: "1px dashed #888" }}>
      <h3>Storybook is rendering</h3>
      <p>If you can see this, the preview is fine and any blank stories are import/config issues.</p>
    </div>
  )
};
