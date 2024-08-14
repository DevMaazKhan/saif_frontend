import { twMerge } from "tailwind-merge";
import { TabMenuItem } from "./TabMenuItem";
import { memo } from "react";

const TabMenu = memo(() => {
  return (
    <div className={twMerge(`fixed w-full bg-white z-10 right-0 border-b-2 border-primary/10 flex items-center tabMenu`)}>
      <TabMenuItem />
      <TabMenuItem />
    </div>
  );
});

export { TabMenu };
