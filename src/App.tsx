import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import { Wrapper } from "./Wrapper";
import { MENU } from "./constants/menu";
import { SideNavLayout } from "./components/app/SideNavLayout/SideNavLayout";
import { Login } from "./pages/login/Login";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <Wrapper>
      <Toaster />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/*" element={<SideNavLayout />}>
          {MENU.map((menu) => (
            <React.Fragment key={menu.id}>
              {menu.path ? <Route path={`${menu.path}/*`} element={<menu.component menu={menu} />} /> : null}
              {menu.child && menu.child.length > 0 ? menu.child.map((el) => <Route key={el.id} path={`${el.path}/*`} element={<el.component menu={el} />} />) : null}
            </React.Fragment>
          ))}
        </Route>
      </Routes>
    </Wrapper>
  );
}

export default App;
