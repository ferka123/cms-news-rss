"use client";

import React, { use, useEffect, useState } from "react";
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
import { useDebounce } from "@/hooks/use-debounce";

type Option = { label: string; value: string | number };

type ComboBoxProps<T extends Option> = {
  defaultOptions?: T[];
  value?: T | null;
  defaultValue?: T | null;
  placeholder?: string;
  className?: string;
  delay?: number;
  onChange?: (option: T | null) => void;
  loader?: (q?: string) => Promise<T[]>;
};

const Combobox = <T extends Option>(
  {
    defaultOptions = [],
    value,
    delay,
    defaultValue = null,
    placeholder,
    onChange,
    className,
    loader,
  }: ComboBoxProps<T>,
  ref: React.ForwardedRef<HTMLInputElement>
) => {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [options, setOptions] = React.useState<T[]>(defaultOptions);
  const [selectedState, setSelectedState] = React.useState<Option | null>(
    defaultValue
  );

  const [inputValue, setInputValue] = useState<string>("");
  const debouncedSearchTerm = useDebounce(inputValue, delay || 500);

  useEffect(() => {
    if (loader) {
      const currentSeachTerm = debouncedSearchTerm;
      setLoading(true);
      loader(debouncedSearchTerm)
        .then((data) => {
          if (currentSeachTerm === debouncedSearchTerm) {
            setOptions(data);
            setLoading(false);
          }
        })
        .catch(() => setLoading(false));
    }
  }, [loader, debouncedSearchTerm]);

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
      <PopoverContent
        className="w-[--radix-popover-trigger-width] p-0"
        side="bottom"
        avoidCollisions={false}
      >
        <Command filter={loader ? () => 1 : undefined}>
          <CommandInput
            value={inputValue}
            onValueChange={setInputValue}
            placeholder={"Search..."}
            ref={ref}
          />
          {loading && (
            <div className="py-6 text-center text-sm">Loading...</div>
          )}

          {!loading && <CommandEmpty>No options found</CommandEmpty>}

          <CommandList className="scrollbars">
            <CommandGroup>
              {!loading &&
                options.map((option, index) => (
                  <CommandItem
                    key={`${option.value}${index}`}
                    value={option.value.toString()}
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
};

export default React.forwardRef(Combobox) as <T extends Option>(
  props: ComboBoxProps<T> & { ref?: React.ForwardedRef<HTMLInputElement> }
) => ReturnType<typeof Combobox>;
