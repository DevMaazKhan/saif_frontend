import { useEffect } from "react";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import { twMerge } from "tailwind-merge";
import { APP_NAME } from "@/constants/setup";
import { Menu } from "@/constants/menu";
import { useNavigate } from "react-router-dom";

interface PageHeaderProps {
  menu: Menu;
  subTitle?: string;
  title?: string;
  actions?: React.ReactNode;
}

const PageHeader = (props: PageHeaderProps) => {
  const { menu, subTitle, title } = props;

  const navigate = useNavigate();

  useEffect(() => {
    document.title = `${title ? title : menu?.title} - ${APP_NAME}`;
  }, [menu, title]);

  return (
    <div className={twMerge(`fixed w-full bg-muted z-10 right-0 border-b-2 border-primary/10 flex items-center px-2 screenHeader`)}>
      <div className="flex flex-row items-center justify-between w-full">
        <div className="flex flex-row items-center gap-3">
          {window.history.state && window.history.state?.idx > 0 ? (
            <ChevronLeftIcon
              onClick={() => {
                navigate(-1);
              }}
              className="w-[23px] h-[23px] cursor-pointer"
            />
          ) : null}
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold m-0 p-0 -mt-2">{title ? title : menu?.pageTitle || ""}</h2>
            <p className="text-xs m-0 p-0 -mt-1">{subTitle ? subTitle : ""}</p>
          </div>
        </div>
        <div>{props.actions}</div>
      </div>
    </div>
  );
};

export { PageHeader };
