import { twMerge } from "tailwind-merge";
import { Navbar } from "../Navbar/Navbar";
import { SideNav } from "../SideNav/SideNav";
import { Footer } from "../Footer/Footer";
import "./sideNavLayout.css";
import { SideNavWrapper } from "./SideNavWrapper";
import { Outlet } from "react-router-dom";

const SideNavLayout = () => {
  return (
    <SideNavWrapper>
      <Navbar />
      <SideNav />
      <Footer />

      <div className={twMerge("content")}>
        <Outlet />
      </div>
    </SideNavWrapper>
  );
};

export { SideNavLayout };
