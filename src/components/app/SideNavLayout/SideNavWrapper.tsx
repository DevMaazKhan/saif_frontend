import { useSideNavContext } from "@/hooks/useSideNavContext";
import { twMerge } from "tailwind-merge";

const SideNavWrapper = ({ children }: { children: React.ReactNode }) => {
  const { isOpen } = useSideNavContext();

  return <div className={twMerge("screenContainer", isOpen ? "sidebarCollapsed" : "sidebarOpened")}>{children}</div>;
};

export { SideNavWrapper };
