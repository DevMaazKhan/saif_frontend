import { SideNavContext } from "@/contexts/SideNavContext";
import { useContext } from "react";

const useSideNavContext = () => useContext(SideNavContext);

export { useSideNavContext };
