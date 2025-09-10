import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Modal } from "../src/components/modal/Modal";
import { Button } from "../src/components/button/Button";

const Demo = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open modal</Button>
      <Modal open={open} onClose={() => setOpen(false)} title="AstronautUI Modal">
        <p>Mobile-first, accessible modal. Press Esc or click backdrop to close.</p>
        <Button onClick={() => setOpen(false)}>Close</Button>
      </Modal>
    </>
  );
};

const meta: Meta<typeof Modal> = { title: "Core/Modal", component: Modal };
export default meta;
export const Basic: StoryObj<typeof Modal> = { render: () => <Demo /> };
