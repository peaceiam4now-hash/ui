import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "../src/components/input/Input";

it("associates label and input; updates value", async () => {
  const user = userEvent.setup();
  render(<Input label="Email" placeholder="you@domain.com" />);
  const input = screen.getByLabelText("Email");
  await user.type(input, "x@x.com");
  expect((input as HTMLInputElement).value).toBe("x@x.com");
});
