import { Cross2Icon } from "@radix-ui/react-icons";

const TabMenuItem = () => {
  return (
    <div className="flex flex-row items-center gap-2 border-r-2 border-b-2 border-primary/50 h-full px-2 cursor-pointer hover:bg-muted transition duration-100">
      <h3 className="text-sm">Product - Edit</h3>
      <Cross2Icon className="w-[14px] h-[14px] cursor-pointer" />
    </div>
  );
};

export { TabMenuItem };
