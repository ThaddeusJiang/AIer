import clsx from "clsx";

export function Container({ className, ...props }: { className?: string; [key: string]: any }) {
  return <div className={clsx("mx-auto max-w-7xl px-2 sm:px-6 lg:px-8", className)} {...props} />;
}
