import { cn } from "@/lib/utils";

const FieldLoader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn("flex gap-1 self-center align-middle", className)}
      {...props}
    >
      <div className="animate-dot-loader inline-block h-1 w-1 align-top rounded-full bg-current" />
      <div className="animate-dot-loader inline-block h-1 w-1 align-top rounded-full delay-150 bg-current" />
      <div className="animate-dot-loader inline-block h-1 w-1 align-top rounded-full delay-300 bg-current" />
    </div>
  );
};

export default FieldLoader;
