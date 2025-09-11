import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "../src/components/button/Button";

it("renders and handles click", async () => {
  const user = userEvent.setup();
  const onClick = vi.fn();
  render(<Button onClick={onClick}>Click me</Button>);
  await user.click(screen.getByRole("button", { name: /click me/i }));
  expect(onClick).toHaveBeenCalledTimes(1);
});
