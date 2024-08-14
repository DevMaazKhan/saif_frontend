"use client";

import * as React from "react";
import { ChevronDownIcon, CheckIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAppContext } from "@/contexts/AppContext";

interface ComboBoxProps {
  options: any[];
  valueKey: string;
  labelKey: string;
  searchKey: string;
  value: string;
  onChange: (value: string, option: any) => void;
  onFocus?: (e: React.FocusEvent<HTMLButtonElement, Element>) => void;
  onBlur?: (e: React.FocusEvent<HTMLButtonElement, Element>) => void;
  label: string;
  placeholder: string;
  autoFocus?: boolean;
  error?: string;
  disabled?: boolean;
}

export const Combobox = React.forwardRef(({ options, valueKey, labelKey, value, onChange, label, searchKey, placeholder, autoFocus = false, error, ...rest }: ComboBoxProps, ref: any) => {
  const [open, setOpen] = React.useState(false);
  const { onContextChange } = useAppContext();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="flex flex-col w-full">
        <PopoverTrigger
          autoFocus={autoFocus}
          asChild
          role="combobox"
          aria-expanded={open}
          disabled={rest.disabled}
          onFocus={(e) => {
            onContextChange(placeholder || "");
            rest.onFocus && rest.onFocus(e);
          }}
          onBlur={(e) => {
            onContextChange("");
            rest.onBlur && rest.onBlur(e);
          }}
          ref={ref}
        >
          <Button variant="outline" role="combobox" aria-expanded={open} btnClassNames="w-full justify-between">
            {value ? options.find((option) => option[valueKey] === value)?.[labelKey] : label}
            <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <span className="text-red-400 text-xs">{error}</span>
      </div>
      <PopoverContent className="w-full p-0" align="start" style={{ pointerEvents: "all" }}>
        <Command>
          <CommandInput
            placeholder={placeholder}
            onFocus={(e) => {
              onContextChange(placeholder || "");
            }}
            onBlur={(e) => {
              onContextChange("");
            }}
          />
          <CommandEmpty>No framework found.</CommandEmpty>
          <CommandGroup className="h-auto max-h-[300px] overflow-y-visible">
            {options.map((option) => (
              <CommandItem
                key={option[valueKey]}
                value={option[searchKey]}
                onSelect={(currentValue) => {
                  onChange(currentValue, option);
                  setOpen(false);
                }}
              >
                <CheckIcon className={cn("mr-2 h-4 w-4", value === option[valueKey] ? "opacity-100" : "opacity-0")} />
                {option[labelKey]}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
});
