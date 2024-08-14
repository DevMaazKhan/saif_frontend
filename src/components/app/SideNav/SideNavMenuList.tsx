import { MENU } from "@/constants/menu";
import { SideNavMenuItem } from "./SideNavMenuItem";

const SideNavMenuList = () => {
  return (
    <div className="px-2 mt-[100px] flex flex-col gap-1">
      {MENU.map((menu) => (menu.hidden ? null : <SideNavMenuItem key={menu.id} path={menu.path} title={menu.title} icon={menu.icon} child={menu.child || []} />))}
    </div>
  );
};

export { SideNavMenuList };
