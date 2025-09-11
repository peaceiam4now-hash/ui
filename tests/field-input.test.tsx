import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

function FieldInput() {
  const id = "email";
  return (
    <div>
      <label htmlFor={id}>Email</label>
      <input id={id} placeholder="you@domain.com" aria-describedby="email-help" />
      <div id="email-help">We’ll never share your email.</div>
    </div>
  );
}

test("renders label, input, and help wiring", () => {
  render(<FieldInput />);
  const input = screen.getByPlaceholderText("you@domain.com");
  expect(screen.getByLabelText("Email")).toBeInTheDocument();
  expect(input).toHaveAttribute("aria-describedby", "email-help");
});
