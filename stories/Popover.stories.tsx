/* @ts-nocheck */
import React from "react";
import { Popover, PopoverTrigger, PopoverContent } from "../src/components/popover/Popover";
import { Button } from "../src/components/button/Button";

export default { title: "Overlay/Popover" };

export const Basic = () => (
  <div style={{ display: "flex", gap: 20, flexWrap: "wrap", padding: 24 }}>
    <Popover>
      <PopoverTrigger>
        <Button>Bottom-start</Button>
      </PopoverTrigger>
      <PopoverContent title="Menu">
        <div style={{ display: "grid", gap: 8 }}>
          <a href="#">Profile</a>
          <a href="#">Settings</a>
          <a href="#">Sign out</a>
        </div>
      </PopoverContent>
    </Popover>

    <Popover side="top" align="center">
      <PopoverTrigger>
        <Button>Top-center</Button>
      </PopoverTrigger>
      <PopoverContent title="Info">
        <p>Centered above the trigger.</p>
      </PopoverContent>
    </Popover>

    <Popover side="right" align="center">
      <PopoverTrigger>
        <Button>Right</Button>
      </PopoverTrigger>
      <PopoverContent title="Quick actions">
        <div style={{ display: "grid", gap: 8 }}>
          <Button size="sm">Run</Button>
          <Button size="sm" variant="secondary">Preview</Button>
        </div>
      </PopoverContent>
    </Popover>
  </div>
);

export const FormInside = () => (
  <div style={{ padding: 24 }}>
    <Popover side="bottom" align="end">
      <PopoverTrigger>
        <Button>Open form</Button>
      </PopoverTrigger>
      <PopoverContent title="Create item">
        <form onSubmit={(e)=>{ e.preventDefault(); alert("Submitted!"); }}>
          <div style={{ display: "grid", gap: 8 }}>
            <label> Name <input style={{ width: 220 }} type="text" placeholder="My item" /> </label>
            <label> Private <input type="checkbox" /> </label>
            <Button size="sm" type="submit">Create</Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  </div>
);
