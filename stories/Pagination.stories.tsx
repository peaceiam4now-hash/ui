import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Pagination } from "../src/components/pagination/Pagination";
import { Button } from "../src/components/button/Button";

const meta: Meta = { title: "Navigation/Pagination" };
export default meta;

export const Basic: StoryObj = {
  render: () => (
    <div style={{ padding: 16 }}>
      <Pagination count={10} />
    </div>
  )
};

export const ManyPages: StoryObj = {
  render: () => (
    <div style={{ padding: 16 }}>
      <Pagination count={100} siblingCount={1} boundaryCount={1} />
    </div>
  )
};

export const Controlled: StoryObj = {
  render: () => {
    const [page, setPage] = React.useState(7);
    return (
      <div style={{ padding: 16, display: "grid", gap: 12 }}>
        <div>Current page: <strong>{page}</strong></div>
        <Pagination count={25} page={page} onChange={setPage} />
        <div style={{ display: "flex", gap: 8 }}>
          <Button size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</Button>
          <Button size="sm" onClick={() => setPage((p) => Math.min(25, p + 1))}>Next</Button>
        </div>
      </div>
    );
  }
};

export const SizesAndOptions: StoryObj = {
  render: () => (
    <div style={{ padding: 16, display: "grid", gap: 16 }}>
      <div>
        <h4>Small</h4>
        <Pagination count={8} size="sm" />
      </div>
      <div>
        <h4>Medium (no first/last)</h4>
        <Pagination count={12} showFirstLast={false} />
      </div>
      <div>
        <h4>Large (no prev/next)</h4>
        <Pagination count={12} showPrevNext={false} size="lg" />
      </div>
      <div>
        <h4>Disabled</h4>
        <Pagination count={9} disabled />
      </div>
    </div>
  )
};
