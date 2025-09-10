import * as React from "react";
import { cx } from "../../utils/cx";
import "./Tabs.css";

export interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

export interface TabsProps {
  tabs: Tab[];
  defaultActiveId?: string;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, defaultActiveId, className }) => {
  const [activeId, setActiveId] = React.useState(defaultActiveId ?? tabs[0]?.id);

  return (
    <div className={cx("aui-tabs", className)}>
      <div role="tablist" className="aui-tabs__list">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeId === tab.id}
            aria-controls={`panel-${tab.id}`}
            id={`tab-${tab.id}`}
            className={cx("aui-tabs__tab", activeId === tab.id && "aui-tabs__tab--active")}
            onClick={() => setActiveId(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`panel-${tab.id}`}
          aria-labelledby={`tab-${tab.id}`}
          hidden={activeId !== tab.id}
          className="aui-tabs__panel"
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
};

export default Tabs;
