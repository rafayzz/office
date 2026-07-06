import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ className, children, ...props }, ref) => {
  return (
    <select
      className={cn(
        'flex h-11 w-full rounded-2xl border border-slate-950/10 bg-white/78 px-3 py-2 text-sm shadow-sm transition-all hover:border-slate-950/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950/15 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </select>
  );
});
Select.displayName = 'Select';
