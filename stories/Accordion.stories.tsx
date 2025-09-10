import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionPanel } from "../src/components/accordion/Accordion";

const meta: Meta = { title: "Navigation/Accordion" };
export default meta;

export const SingleCollapsible: StoryObj = {
  render: () => (
    <div style={{ padding: 16 }}>
      <Accordion type="single" collapsible defaultValue="a">
        <AccordionItem value="a">
          <AccordionTrigger value="a">Account settings</AccordionTrigger>
          <AccordionPanel value="a">
            Manage your profile, 2FA, and connected apps.
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem value="b">
          <AccordionTrigger value="b">Billing</AccordionTrigger>
          <AccordionPanel value="b">
            Update card, invoices, and receipts.
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem value="c">
          <AccordionTrigger value="c">Team</AccordionTrigger>
          <AccordionPanel value="c">
            Invite members and set roles.
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </div>
  )
};

export const Multiple: StoryObj = {
  render: () => (
    <div style={{ padding: 16 }}>
      <Accordion type="multiple" defaultValue={["one"]}>
        <AccordionItem value="one">
          <AccordionTrigger value="one">First</AccordionTrigger>
          <AccordionPanel value="one">First panel content</AccordionPanel>
        </AccordionItem>
        <AccordionItem value="two">
          <AccordionTrigger value="two">Second</AccordionTrigger>
          <AccordionPanel value="two">Second panel content</AccordionPanel>
        </AccordionItem>
        <AccordionItem value="three">
          <AccordionTrigger value="three">Third (disabled)</AccordionTrigger>
          <AccordionPanel value="three">Disabled content</AccordionPanel>
        </AccordionItem>
      </Accordion>
    </div>
  )
};

export const Controlled: StoryObj = {
  render: () => {
    const [val, setVal] = React.useState<string | string[]>("x");
    return (
      <div style={{ padding: 16, display: "grid", gap: 12 }}>
        <div>value: <b>{Array.isArray(val) ? val.join(", ") : val}</b></div>
        <Accordion type="single" value={val as string} onValueChange={setVal}>
          <AccordionItem value="x">
            <AccordionTrigger value="x">X</AccordionTrigger>
            <AccordionPanel value="x">Panel X</AccordionPanel>
          </AccordionItem>
          <AccordionItem value="y">
            <AccordionTrigger value="y">Y</AccordionTrigger>
            <AccordionPanel value="y">Panel Y</AccordionPanel>
          </AccordionItem>
        </Accordion>
      </div>
    );
  }
};
