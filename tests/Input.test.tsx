import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "../src/components/input/Input";
import * as React from "react";

it("associates label and input; updates value", async () => {
  const user = userEvent.setup();
  render(<Input label="Email" placeholder="you@domain.com" />);
  const input = screen.getByLabelText("Email");
  await user.type(input, "x@x.com");
  expect((input as HTMLInputElement).value).toBe("x@x.com");
});

it("exposes hint and error via aria-describedby", () => {
  render(<Input label="Field" hint="Helpful hint" error="Something went wrong" />);
  const input = screen.getByLabelText("Field");
  const describedby = input.getAttribute("aria-describedby")!;
  const ids = describedby.split(" ");
  ids.forEach(id => expect(document.getElementById(id)).toBeTruthy());
});

it("toggles password visibility when revealPasswordToggle is enabled", async () => {
  const user = userEvent.setup();
  render(<Input label="Password" type="password" revealPasswordToggle />);
  const btn = screen.getByRole("button", { name: /show password/i });
  await user.click(btn);
  expect(btn).toHaveAttribute("aria-pressed", "true");
  const input = screen.getByLabelText("Password");
  expect(input).toHaveAttribute("type", "text");
});
