import AppContextProvider from "./contexts/AppContext";
import BackgroundWorkerContextProvider from "./contexts/BackgroundWorkerContext";
import LoadingContextProvider from "./contexts/LoadingContext";
import SideNavContextProvider from "./contexts/SideNavContext";

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <AppContextProvider>
      <BackgroundWorkerContextProvider>
        <LoadingContextProvider>
          <SideNavContextProvider>{children}</SideNavContextProvider>
        </LoadingContextProvider>
      </BackgroundWorkerContextProvider>
    </AppContextProvider>
  );
};

export { Wrapper };
