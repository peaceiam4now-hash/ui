import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Breadcrumbs } from "../src/components/breadcrumbs/Breadcrumbs";

const meta: Meta = { title: "Navigation/Breadcrumbs" };
export default meta;

export const Basic: StoryObj = {
  render: () => (
    <div style={{padding:16}}>
      <Breadcrumbs items={[
        { label: "Home", href: "#" },
        { label: "Library", onClick: () => console.log("go library") },
        { label: "Components", href: "#" },
        { label: "Breadcrumbs" }
      ]}/>
    </div>
  )
};

export const LongLabels: StoryObj = {
  render: () => (
    <div style={{padding:16, maxWidth: 480}}>
      <Breadcrumbs items={[
        { label: "Home", href: "#" },
        { label: "Really Long Section Name That Should Truncate Nicely", href: "#" },
        { label: "Another Deep Nest With A Verbose Title", href: "#" },
        { label: "Current Page" }
      ]} separator="›" />
    </div>
  )
};

export const ButtonsOnly: StoryObj = {
  render: () => (
    <div style={{padding:16}}>
      <Breadcrumbs items={[
        { label: "Back", onClick: () => alert("Back") },
        { label: "Folder", onClick: () => alert("Folder") },
        { label: "File.txt" }
      ]} />
    </div>
  )
};
