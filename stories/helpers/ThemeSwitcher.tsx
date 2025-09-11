import * as React from "react";

type Scheme = "light" | "dark";

export default function ThemeSwitcher() {
  const [scheme, setScheme] = React.useState<Scheme>(() => {
    if (typeof document === "undefined") return "light";
    return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
  });

  React.useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.dataset.theme = scheme;
  }, [scheme]);

  return (
    <div style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
      <label style={{ fontSize: 12, opacity: 0.8 }}>Theme</label>
      <select
        value={scheme}
        onChange={(e) => setScheme(e.target.value as Scheme)}
        style={{ fontSize: 12, padding: "4px 8px" }}
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </div>
  );
}
