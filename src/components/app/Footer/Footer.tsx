import { Loading } from "@/components/ui/loading";
import { APP_VERSION } from "@/constants/setup";
import { useAppContext } from "@/contexts/AppContext";
import { useBackgroundWorkerContext } from "@/contexts/BackgroundWorkerContext";
import { useLoadingContext } from "@/contexts/LoadingContext";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";
import { memo } from "react";
import { twMerge } from "tailwind-merge";

const Footer = memo(() => {
  const { isLoading, loadingReason } = useLoadingContext();
  const { currentContext } = useAppContext();
  const { worker } = useBackgroundWorkerContext();

  return (
    <div className={twMerge(`fixed bottom-0 w-full bg-muted z-[60] right-0 border-t-2 border-primary/10 flex items-center px-1 footer`)}>
      <div className="flex flex-row w-full justify-between">
        <div>
          <p className="text-xs text-primary font-semibold">{currentContext}</p>
        </div>

        <div className="flex flex-row gap-5">
          <div>
            <p className="text-xs bg-slate-200 rounded-md py-[1px] text-black px-2 text-primary font-bold">{APP_VERSION}</p>
          </div>
          {worker.isWorking ? (
            <div className="flex flex-row items-center gap-2">
              <p className="text-xs text-primary font-semibold">{worker.workingOn}</p>
              <Loading loading className="w-[8px] h-[8px]" color="stroke-primary fill-primary" />
            </div>
          ) : null}
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger>
                <Loading loading={isLoading} className="w-[14px] h-[14px]" color="stroke-primary fill-primary" />
              </TooltipTrigger>
              <TooltipContent className="bg-white px-2 py-1 rounded-md shadow-md">
                <p className="text-sm">{loadingReason ? `${loadingReason}...` : "Idle"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
});

export { Footer };
