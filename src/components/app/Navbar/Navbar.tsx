import { twMerge } from "tailwind-merge";
import { SideNavToggler } from "./SideNavToggler";
import { memo } from "react";

const Navbar = memo(() => {
  return (
    <div className={twMerge(`fixed top-0 z-10 right-0 flex items-center px-1 border-b-2 border-primary/20 bg-white navbar`)}>
      <SideNavToggler />
    </div>
  );
});

export { Navbar };
