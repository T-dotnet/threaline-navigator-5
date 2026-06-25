import * as React from "react";
import { cn } from "../../lib/utils";

interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function PageContainer({ children, className, ...props }: PageContainerProps) {
  return (
    <div 
      className={cn("w-full max-w-5xl mx-auto px-6 sm:px-8 md:px-12", className)} 
      {...props}
    >
      {children}
    </div>
  );
}
