/* @ts-nocheck */
import React from "react";
import { ToastProvider, useToast } from "../src/components/toast/Toast";
import { Button } from "../src/components/button/Button";

export default { title: "Feedback/Toast" };

function Demo() {
  const { push, clear } = useToast();

  const fire = (variant, title, description) => {
    push({
      variant,
      title,
      description,
      duration: 4000,
      action: { label: "Undo", onClick: () => push({ title: "Undone", variant: "default" }) },
    });
  };

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Button onClick={() => fire("default", "Saved", "Your changes are live.")}>Default</Button>
        <Button onClick={() => fire("success", "Success", "Everything went great!")}>Success</Button>
        <Button onClick={() => fire("warning", "Heads up", "Something needs your attention.")}>Warning</Button>
        <Button onClick={() => fire("danger", "Error", "Something went wrong.")}>Danger</Button>
      </div>
      <div>
        <Button variant="secondary" onClick={() => clear()}>Clear all</Button>
      </div>
      <p>Toasts auto-dismiss after 4s. Hover to pause styling; click × to dismiss.</p>
    </div>
  );
}

export const Basic = () => (
  <ToastProvider position="top-right">
    <div style={{ minHeight: "120vh", padding: 16, background: "linear-gradient(180deg,#f8fafc,#eef2ff)" }}>
      <Demo />
    </div>
  </ToastProvider>
);

export const BottomCenter = () => (
  <ToastProvider position="bottom-center">
    <div style={{ minHeight: "80vh", padding: 16 }}>
      <Demo />
    </div>
  </ToastProvider>
);
