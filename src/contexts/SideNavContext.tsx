import { createContext, useMemo, useState } from "react";

interface SideNavContextProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const sideNavContextDefaultValues: SideNavContextProps = {
  isOpen: false,
  setIsOpen: () => true,
};

export const SideNavContext = createContext(sideNavContextDefaultValues);

const SideNavContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const values = useMemo(
    () => ({
      isOpen,
      setIsOpen,
    }),
    [isOpen]
  );

  return <SideNavContext.Provider value={values}>{children}</SideNavContext.Provider>;
};

export default SideNavContextProvider;
