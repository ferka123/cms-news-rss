"use client";

import React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Option } from "@/lib/common/schemas";

type ComboBoxProps = {
  options?: Option[];
  value?: Option | null;
  defaultValue?: Option | null;
  placeholder?: string;
  className?: string;
  onChange?: (option: Option | null) => void;
};

export function ComboboxDemo({
  options = [],
  value,
  defaultValue = null,
  placeholder,
  onChange,
  className,
}: ComboBoxProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedState, setSelectedState] = React.useState<Option | null>(
    defaultValue
  );

  const internalSelected = value ?? selectedState;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          {internalSelected
            ? internalSelected.label
            : placeholder ?? "Select..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder={"Search..."} />
          <CommandEmpty>No options found</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {options.map((option, index) => (
                <CommandItem
                  key={`${option.value}${index}`}
                  value={option.label}
                  onSelect={() => {
                    setSelectedState(option);
                    if (onChange) onChange(option);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      internalSelected?.value === option.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
