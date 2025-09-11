import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { PaginationFooter } from "../src/components/pagination/PaginationFooter";

const meta: Meta = { title: "Navigation/Pagination Footer" };
export default meta;

export const Basic: StoryObj = {
  render: () => (
    <div style={{ padding: 16 }}>
      <PaginationFooter totalItems={1248} defaultPageSize={25} />
    </div>
  ),
};

export const Controlled: StoryObj = {
  render: () => {
    const [page, setPage] = React.useState(3);
    const [size, setSize] = React.useState(50);
    const total = 987;

    return (
      <div style={{ padding: 16, display: "grid", gap: 12 }}>
        <div>
          page: <b>{page}</b> • size: <b>{size}</b> • pages: <b>{Math.max(1, Math.ceil(total/size))}</b>
        </div>
        <PaginationFooter
          totalItems={total}
          page={page}
          onPageChange={setPage}
          pageSize={size}
          onPageSizeChange={setSize}
          pageSizeOptions={[10, 25, 50, 100, 250]}
          keepPageOnSizeChange
        />
      </div>
    );
  },
};

export const CompactAndSmall: StoryObj = {
  render: () => (
    <div style={{ padding: 16 }}>
      <PaginationFooter totalItems={300} defaultPageSize={10} compact />
    </div>
  ),
};

export const ZeroItems: StoryObj = {
  render: () => (
    <div style={{ padding: 16 }}>
      <PaginationFooter totalItems={0} />
    </div>
  ),
};
