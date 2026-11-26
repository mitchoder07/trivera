"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Lightweight Select component matching shadcn/ui API.
 * Built on native <select> for zero-dep reliability.
 */

interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  disabled?: boolean;
}

export function Select({ value, onValueChange, children, disabled }: SelectProps) {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  // Find the selected child to show its label
  const selectedLabel = React.Children.toArray(children)
    .flatMap((child) => {
      if (!React.isValidElement(child)) return [];
      const childProps = child.props as { children?: React.ReactNode };
      if (childProps.children && typeof childProps.children === "object") {
        return React.Children.toArray(childProps.children).map((c) => {
          if (React.isValidElement(c)) {
            const cProps = c.props as { value?: string; children?: React.ReactNode };
            if (cProps.value === value) return cProps.children;
          }
          return null;
        });
      }
      return [];
    })
    .find(Boolean) as React.ReactNode | undefined;

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:cursor-not-allowed disabled:opacity-50",
          !value && "text-gray-400"
        )}
      >
        <span>{selectedLabel || "Select..."}</span>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </button>
      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg">
            {React.Children.map(children, (child) => {
              if (!React.isValidElement(child)) return child;
              return React.cloneElement(child, {
                onSelect: (v: string) => {
                  onValueChange?.(v);
                  setOpen(false);
                },
                isSelected: value,
              } as React.Attributes);
            })}
          </div>
        </>
      )}
    </div>
  );
}

interface SelectContentProps {
  children: React.ReactNode;
  className?: string;
}

export function SelectContent({ children, className }: SelectContentProps) {
  return <div className={className}>{children}</div>;
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  onSelect?: (value: string) => void;
  isSelected?: string;
}

export function SelectItem({ value, children, className, onSelect, isSelected }: SelectItemProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(value)}
      className={cn(
        "flex w-full items-center px-3 py-1.5 text-left text-sm hover:bg-orange-50",
        isSelected === value && "bg-orange-100 font-medium",
        className
      )}
    >
      {children}
    </button>
  );
}

interface SelectTriggerProps {
  children: React.ReactNode;
  className?: string;
}

export function SelectTrigger({ children, className }: SelectTriggerProps) {
  return <div className={className}>{children}</div>;
}

interface SelectValueProps {
  placeholder?: string;
  className?: string;
}

export function SelectValue({ placeholder, className }: SelectValueProps) {
  return <span className={cn("text-gray-400", className)}>{placeholder}</span>;
}
