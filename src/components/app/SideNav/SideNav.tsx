import { twMerge } from "tailwind-merge";
import { SideNavMenuList } from "./SideNavMenuList";
import { memo, useRef } from "react";
import { GearIcon } from "@radix-ui/react-icons";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useBackgroundWorkerContext } from "@/contexts/BackgroundWorkerContext";
import { useMutation } from "@tanstack/react-query";
import backupApi from "@/api/backup.api";
import { useToast } from "@/components/ui/use-toast";

const SideNav = memo(() => {
  const { startWorking } = useBackgroundWorkerContext();
  const { toast } = useToast();

  const inputRef = useRef<HTMLInputElement>(null);

  const { mutateAsync: createBackup } = useMutation({
    mutationFn: () => backupApi.createBackup(),
    onSuccess: (data) => {
      const blob = new Blob([data.data], { type: data.headers["content-type"] });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `backup.zip`; // Specify the desired file name
      document.body.appendChild(a);
      a.click();

      // Clean up the temporary URL and anchor element
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
  });
  const { mutateAsync: importBackup } = useMutation({
    mutationFn: (data: any) => backupApi.importBackup(data),
    onSuccess: (data) => {
      toast({
        title: "Data Imported Successfully",
        className: "bg-green-400 text-white",
      });
    },
  });

  async function onBackup() {
    await createBackup();
  }

  function onBackupUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const formData = new FormData();

    formData.append("file", event.target.files[0]);

    async function startBackup() {
      await importBackup(formData);
    }

    startWorking<ReturnType<typeof startBackup>>("Data backup import is in progress", startBackup);
  }

  async function onBackupImportHandler() {
    inputRef.current?.click();
  }

  function onBackupClickHandler() {
    startWorking<ReturnType<typeof onBackup>>("Data backup is in progress", onBackup);
  }

  return (
    <div className={twMerge(`fixed top-0 bg-white h-full z-10 border-r-2 border-primary/50 sidebar`)}>
      <div className="p-2">
        <img className="w-[60px]" src="./zain.png" />
      </div>
      <SideNavMenuList />

      <input type="file" ref={inputRef} style={{ display: "none" }} accept=".zip" onChange={onBackupUpload} />

      <div className="fixed sidebar_footer bottom-0 py-1 px-2 flex items-center justify-start bg-[#eee] h-[50px]">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="bg-primary/25 p-2 rounded-md cursor-pointer transition-all duration-200 hover:bg-primary/50">
              <GearIcon className="w-[18px] h-[18px]" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={onBackupClickHandler}>Export Backup</DropdownMenuItem>
            <DropdownMenuItem onClick={onBackupImportHandler}>Import Backup</DropdownMenuItem>
            {/* <DropdownMenuItem>Lock Screen</DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
});

export { SideNav };
