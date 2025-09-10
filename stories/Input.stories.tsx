/* @ts-nocheck */
import React from "react";
import { Field } from "../src/components/field/Field";
import { Input } from "../src/components/input/Input";
import { Button } from "../src/components/button/Button";

export default { title: "Forms/Input" };

export const Basic = () => (
  <div style={{ padding: 24, display: "grid", gap: 16, maxWidth: 420 }}>
    <Field label="Name" description="What should we call you?">
      <Input placeholder="Jane Doe" />
    </Field>
    <Field label="Email" required error="Please enter a valid email">
      <Input type="email" placeholder="jane@example.com" />
    </Field>
    <div style={{ display: "flex", gap: 8 }}>
      <Button>Submit</Button>
      <Button variant="secondary">Cancel</Button>
    </div>
  </div>
);

export const Sizes = () => (
  <div style={{ padding: 24, display: "grid", gap: 12, maxWidth: 420 }}>
    <Field label="Small">
      <Input size="sm" placeholder="Small size" />
    </Field>
    <Field label="Medium (default)">
      <Input size="md" placeholder="Medium size" />
    </Field>
    <Field label="Large">
      <Input size="lg" placeholder="Large size" />
    </Field>
  </div>
);
