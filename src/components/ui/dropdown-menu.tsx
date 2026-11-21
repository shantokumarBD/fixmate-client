"use client";

import * as React from "react";

interface DropdownContextType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DropdownContext = React.createContext<DropdownContextType>({
  open: false,
  setOpen: () => {},
});

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block text-left" ref={menuRef}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

export function DropdownMenuTrigger({
  children,
  asChild,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }) {
  const { open, setOpen } = React.useContext(DropdownContext);

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<{
      onClick?: (e: React.MouseEvent) => void;
      className?: string;
    }>;
    return React.cloneElement(child, {
      onClick: (e: React.MouseEvent) => {
        child.props.onClick?.(e);
        setOpen((prev) => !prev);
      },
    });
  }

  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
}

export function DropdownMenuContent({
  align = "end",
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { align?: "start" | "end" | "center" }) {
  const { open } = React.useContext(DropdownContext);

  if (!open) return null;

  const alignClass =
    align === "end" ? "right-0" : align === "center" ? "left-1/2 -translate-x-1/2" : "left-0";

  return (
    <div
      className={`absolute ${alignClass} mt-2 min-w-[15rem] z-50 overflow-hidden rounded-[8px] border-2 border-[#151515] bg-white p-2.5 text-[#151515] shadow-[4px_4px_0px_#151515] animate-in fade-in zoom-in-95 duration-100 flex flex-col gap-1 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function DropdownMenuItem({
  asChild,
  variant = "default",
  className = "",
  children,
  onClick,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  asChild?: boolean;
  variant?: "default" | "destructive";
}) {
  const { setOpen } = React.useContext(DropdownContext);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    onClick?.(e);
    setOpen(false);
  };

  const variantClass =
    variant === "destructive"
      ? "text-[#BA1A1A] hover:bg-[#FFDAD6] hover:border-[#151515]"
      : "text-[#151515] hover:bg-[#FCD03D] hover:border-[#151515]";

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<{
      onClick?: (e: React.MouseEvent<HTMLElement>) => void;
      className?: string;
    }>;
    return React.cloneElement(child, {
      onClick: (e: React.MouseEvent<HTMLElement>) => {
        child.props.onClick?.(e);
        setOpen(false);
      },
      className: `relative flex cursor-pointer select-none items-center gap-2 rounded-[4px] px-2 py-2 font-heading font-bold text-xs uppercase tracking-wider outline-none transition-colors border border-transparent ${variantClass} ${child.props.className || ""} ${className}`,
    });
  }

  return (
    <div
      onClick={handleClick}
      className={`relative flex cursor-pointer select-none items-center gap-2 rounded-[4px] px-2 py-2 font-heading font-bold text-xs uppercase tracking-wider outline-none transition-colors border border-transparent ${variantClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function DropdownMenuSeparator({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`my-1 h-0.5 border-t-2 border-dashed border-[#151515] ${className}`}
      {...props}
    />
  );
}