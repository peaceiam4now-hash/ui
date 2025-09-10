import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { Modal } from "../src/components/modal/Modal";

it("opens and closes with backdrop and Esc", async () => {
  const user = userEvent.setup();
  const Wrapper = () => {
    const [open, setOpen] = React.useState(true);
    return <>{open && <Modal open={open} onClose={() => setOpen(false)} title="T" />}</>;
  };
  render(<Wrapper />);
  // Esc closes
  await user.keyboard("{Escape}");
  expect(screen.queryByRole("dialog")).toBeNull();
});
