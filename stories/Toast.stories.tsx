/* @ts-nocheck */
import React from "react";
import { ToastProvider, useToast, toast } from "../src/components/toast/Toast";
import { Button } from "../src/components/button/Button";

export default { title: "Feedback/Toast" };

function Demo() {
  const { push, clear } = useToast();
  const fire = (variant: string, title: string, description: string) =>
    push({
      variant, title, description, duration: 4000,
      action: { label: "Undo", onClick: () => push({ title: "Undone", variant: "default" }) },
    });

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Button onClick={() => fire("default", "Saved", "Your changes are live.")}>Default</Button>
        <Button onClick={() => fire("success", "Success", "Everything went great!")}>Success</Button>
        <Button onClick={() => fire("warning", "Heads up", "Check your inputs.")}>Warning</Button>
        <Button onClick={() => fire("danger", "Error", "Something went wrong.")}>Danger</Button>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Button  onClick={() => clear()}>Clear all</Button>
        <Button  onClick={() => toast.success("Saved via global", "Used toast.success(...)")}>
          Global helper
        </Button>
      </div>
      <p>Tip: drag a toast left/right to dismiss; hover pauses the progress bar.</p>
    </div>
  );
}

export const Basic = () => {
  const [host, setHost] = React.useState(null);
  return (
    <div style={{ minHeight: "120vh", padding: 16, background: "linear-gradient(180deg,#f8fafc,#eef2ff)", position: "relative" }}>
      <div ref={(el) => setHost(el)} />
      {host && (
        <ToastProvider position="top-right" container={host}>
          <Demo />
        </ToastProvider>
      )}
    </div>
  );
};

export const BottomCenter = () => {
  const [host, setHost] = React.useState(null);
  return (
    <div style={{ minHeight: "80vh", padding: 16, position: "relative" }}>
      <div ref={(el) => setHost(el)} />
      {host && (
        <ToastProvider position="bottom-center" container={host}>
          <Demo />
        </ToastProvider>
      )}
    </div>
  );
};
