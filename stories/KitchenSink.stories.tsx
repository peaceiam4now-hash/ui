import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

// Import your components as they exist in your repo:
import { Tooltip } from "../src/components/tooltip/Tooltip";
import { Popover, PopoverTrigger, PopoverContent } from "../src/components/popover/Popover";
import { Checkbox } from "../src/components/checkbox/Checkbox";
import { Radio, RadioGroup } from "../src/components/radio/Radio";
import { Textarea } from "../src/components/textarea/Textarea";
import { Select } from "../src/components/select/Select";
// If you have a Navbar/AppBar component, import it here.

const meta: Meta = {
  title: "Kitchen Sink/Overview",
};
export default meta;

type Story = StoryObj;

export const Demo: Story = {
  render: () => {
    const [newsletter, setNewsletter] = React.useState(true);
    const [plan, setPlan] = React.useState("pro");

    return (
      <div style={{ padding: 24, display: "grid", gap: 24, background: "var(--aui-color-surface)" }}>
        {/* Navbar spot (if you have one) */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <strong>🚀 AstronautUI</strong>
          <div style={{ display: "flex", gap: 12 }}>
            <Tooltip content="View notifications" placement="bottom">
              <button>🔔</button>
            </Tooltip>
            <Popover>
              <PopoverTrigger>
                <button>Profile ▾</button>
              </PopoverTrigger>
              <PopoverContent title="Account">
                <div style={{ display: "grid", gap: 8 }}>
                  <button>Settings</button>
                  <button>Sign out</button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Form section */}
        <section style={{ display: "grid", gap: 12, maxWidth: 560 }}>
          <h3 style={{ margin: 0 }}>Signup</h3>

          <label className="aui-checkbox">
            <Checkbox
              label="Join our newsletter"
              checked={newsletter}
              onChange={(ck) => setNewsletter(ck)}
              description="We send occasional product updates."
            />
          </label>

          <div>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>Plan</div>
            <RadioGroup value={plan} onValueChange={setPlan} orientation="horizontal">
              <Radio value="free" label="Free" />
              <Radio value="pro" label="Pro" />
              <Radio value="team" label="Team" />
            </RadioGroup>
          </div>

          <Textarea placeholder="Tell us about your project…" maxLength={200} showCount />

          <Select defaultValue="">
            <option value="" disabled>Choose a country</option>
            <option>United States</option>
            <option>Canada</option>
            <option>Germany</option>
          </Select>

          <div style={{ display: "flex", gap: 8 }}>
            <button>Submit</button>
            <Tooltip content="We’ll save your progress">
              <button type="button">Save draft</button>
            </Tooltip>
          </div>
        </section>
      </div>
    );
  },
};
