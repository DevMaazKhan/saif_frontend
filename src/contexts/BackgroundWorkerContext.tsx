import { createContext, useMemo, useState, useContext } from "react";

interface IWorker {
  isWorking: boolean;
  workingOn: string | null;
}

const defaultWorker: IWorker = {
  isWorking: false,
  workingOn: null,
};

interface BackgroundWorkerContext {
  worker: IWorker;
  startWorking<T extends object>(workTitle: string, workFn: () => T): Promise<void>;
}

const backgroundWorkerContextDefaultValues: BackgroundWorkerContext = {
  worker: defaultWorker,
  startWorking: async () => {},
};

const BackgroundWorkerContext = createContext(backgroundWorkerContextDefaultValues);

export const useBackgroundWorkerContext = () => useContext(BackgroundWorkerContext);

const BackgroundWorkerContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [worker, setWorker] = useState<IWorker>(defaultWorker);

  async function startWorking<T extends object>(workTitle: string, workFn: () => T) {
    setWorker({
      isWorking: true,
      workingOn: workTitle,
    });

    await workFn();

    setWorker({
      isWorking: false,
      workingOn: null,
    });
  }

  const value: BackgroundWorkerContext = useMemo(
    () => ({
      worker,
      startWorking,
    }),
    [worker]
  );

  return <BackgroundWorkerContext.Provider value={value}>{children}</BackgroundWorkerContext.Provider>;
};

export default BackgroundWorkerContextProvider;
