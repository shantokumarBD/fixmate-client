import * as React from "react";

export function Avatar({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full border-2 border-[#151515] bg-[#FCD03D] shadow-[1px_1px_0px_#151515] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function AvatarImage({
  src,
  alt = "Avatar",
  className = "",
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [hasError, setHasError] = React.useState(false);

  if (!src || hasError) return null;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={`aspect-square h-full w-full object-cover rounded-full ${className}`}
      {...props}
    />
  );
}

export function AvatarFallback({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`flex h-full w-full items-center justify-center font-heading font-bold text-xs uppercase text-[#151515] bg-[#FCD03D] rounded-full select-none ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}