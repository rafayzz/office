import * as React from 'react';
import { cn } from '@/lib/utils';

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        'flex min-h-[110px] w-full rounded-2xl border border-slate-950/10 bg-white/78 px-3 py-2 text-sm shadow-sm transition-all placeholder:text-muted-foreground hover:border-slate-950/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950/15 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = 'Textarea';
