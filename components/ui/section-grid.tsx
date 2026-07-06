import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function SectionGrid({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('grid gap-5 md:grid-cols-2 xl:grid-cols-4', className)}>{children}</div>;
}
