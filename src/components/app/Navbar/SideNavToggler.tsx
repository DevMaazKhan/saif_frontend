import { useSideNavContext } from "@/hooks/useSideNavContext";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { useCallback } from "react";

const SideNavToggler = () => {
  const { setIsOpen } = useSideNavContext();

  const onToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return (
    <div className="p-1 rounded-md cursor-pointer" onClick={onToggle}>
      <HamburgerMenuIcon className="w-[23px] h-[23px]" />
    </div>
  );
};

export { SideNavToggler };
