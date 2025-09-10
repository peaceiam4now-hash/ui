/* @ts-nocheck */
import React from "react";
import { Switch } from "../src/components/switch/Switch";
import { Field } from "../src/components/field/Field";

export default { title: "Forms/Switch" };

export const Basic = () => {
  const [val, setVal] = React.useState(false);
  return (
    <div style={{ padding: 24, display: "grid", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Switch defaultChecked />
        <span>Default on</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Switch checked={val} onCheckedChange={setVal} />
        <span>Controlled: {String(val)}</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Switch size="sm" />
        <span>Small size</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Switch disabled />
        <span>Disabled</span>
      </div>
    </div>
  );
};

// Example with Field just to reuse spacing/label (no htmlFor because Switch is a button)
export const WithLabel = () => (
  <div style={{ padding: 24, maxWidth: 420 }}>
    <Field label="Enable notifications" description="Sends you updates about activity">
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Switch defaultChecked />
        <span>On</span>
      </div>
    </Field>
  </div>
);
