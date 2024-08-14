import { useSideNavContext } from "@/hooks/useSideNavContext";
import { ChevronDownIcon, DotFilledIcon } from "@radix-ui/react-icons";
import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";

interface SideNavMenuItemProps {
  title: string;
  icon?: JSX.Element;
  path?: string;
  child: { id: string; title: string }[];
}

const SideNavMenuItem = (props: SideNavMenuItemProps) => {
  const { title, icon, child, path } = props;

  const [selected, setSelected] = useState(false);

  const { isOpen } = useSideNavContext();

  const dropDownHeight = useRef<HTMLDivElement | null>(null);

  const navigate = useNavigate();

  function onClickHandler() {
    if (!isOpen) setSelected((prev) => !prev);
    if (path) {
      navigate(path);
    }
  }

  function onChildClickHandler(childPath: string) {
    if (childPath) {
      navigate(childPath);
    }
  }

  return (
    <div
      className="cursor-pointer relative p-[16px] hover:bg-primary/10 rounded-md select-none group after:content-[''] after:w-[12px] after:h-[100%] after:translate-x-full after:bg-transparent after:pointer-events-none hover:after:pointer-events-auto after:absolute after:top-0 after:right-0"
      onClick={onClickHandler}
    >
      <div className="flex flex-row items-center justify-between">
        <div className="flex items-center justify-center relative">
          {icon && icon}
          {/* <GearIcon className="w-[18px] h-[18px]" /> */}
          <h5 className={twMerge(`text-base menu-heading absolute duration-150 left-[30px] whitespace-nowrap overflow-hidden overflow-ellipsis`)}>{title}</h5>
        </div>
        {child.length > 0 ? (
          <div className={twMerge("transition-all duration-100 absolute right-[20px] menu-icon", selected ? "rotate-180" : "rotate-0")}>
            <ChevronDownIcon />
          </div>
        ) : null}

        {child.length > 0 ? (
          <div className="collapsed_menu_dropdown absolute z-20 p-2 rounded-md bg-white shadow-md top-3 right-[12px] translate-x-full opacity-0 overflow-visible pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-150">
            {child.map((el) => (
              <Link to={el.path} key={el.id}>
                <div className="flex flex-row gap-1 pl-[5px] p-1 pr-[10px] items-center rounded-md hover:bg-primary/10">
                  <DotFilledIcon className="text-primary opacity-60" />
                  <h5 className={twMerge(`text-base whitespace-nowrap overflow-hidden overflow-ellipsis`)}>{el.title}</h5>
                </div>
              </Link>
            ))}
          </div>
        ) : null}
      </div>
      {child.length > 0 ? (
        <div
          ref={dropDownHeight}
          className={twMerge("ml-[21px] box-border transition-all duration-300 overflow-hidden dropdown-menu", selected ? "opacity-100" : "opacity-0")}
          style={{
            height: selected ? `${dropDownHeight.current?.scrollHeight}px` : "0px",
          }}
        >
          {child.map((el) => (
            <Link to={el.path} key={el.id}>
              <div key={el.id} className="flex mt-2 flex-row gap-1 pl-[5px] p-1 items-center rounded-md hover:bg-primary/10">
                <DotFilledIcon className="text-primary opacity-60" />
                <h5 className={twMerge(`text-base whitespace-nowrap overflow-hidden overflow-ellipsis`)}>{el.title}</h5>
              </div>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export { SideNavMenuItem };
