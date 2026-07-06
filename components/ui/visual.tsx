import {
  Bell,
  Boxes,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  Command,
  FileBarChart2,
  HardDrive,
  KeyRound,
  Laptop,
  LayoutDashboard,
  Megaphone,
  Package,
  PackageSearch,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  TicketCheck,
  UserRound,
  UsersRound,
  type LucideIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { VisualName } from '@/lib/visuals';

const visualMap: Record<VisualName, { icon: LucideIcon; gradient: string; glow: string }> = {
  logo: { icon: Sparkles, gradient: 'from-slate-950 via-slate-800 to-amber-500', glow: 'bg-amber-300/45' },
  dashboard: { icon: LayoutDashboard, gradient: 'from-slate-950 via-slate-800 to-sky-500', glow: 'bg-sky-300/35' },
  requests: { icon: ClipboardCheck, gradient: 'from-slate-950 via-indigo-900 to-violet-500', glow: 'bg-violet-300/35' },
  employees: { icon: UsersRound, gradient: 'from-slate-950 via-sky-900 to-cyan-500', glow: 'bg-cyan-300/35' },
  assets: { icon: Laptop, gradient: 'from-slate-950 via-emerald-950 to-emerald-400', glow: 'bg-emerald-300/35' },
  inventory: { icon: Boxes, gradient: 'from-slate-950 via-orange-950 to-amber-400', glow: 'bg-amber-300/35' },
  tickets: { icon: TicketCheck, gradient: 'from-slate-950 via-fuchsia-950 to-purple-400', glow: 'bg-fuchsia-300/35' },
  announcements: { icon: Megaphone, gradient: 'from-slate-950 via-rose-950 to-red-400', glow: 'bg-rose-300/35' },
  reports: { icon: FileBarChart2, gradient: 'from-slate-950 via-blue-950 to-blue-400', glow: 'bg-blue-300/35' },
  settings: { icon: Settings, gradient: 'from-slate-950 via-indigo-950 to-indigo-400', glow: 'bg-indigo-300/35' },
  profile: { icon: UserRound, gradient: 'from-slate-950 via-slate-800 to-slate-500', glow: 'bg-slate-300/35' },
  security: { icon: ShieldCheck, gradient: 'from-slate-950 via-emerald-950 to-teal-400', glow: 'bg-teal-300/35' },
  notification: { icon: Bell, gradient: 'from-slate-950 via-violet-950 to-fuchsia-400', glow: 'bg-fuchsia-300/35' },
  search: { icon: Search, gradient: 'from-slate-950 via-slate-800 to-slate-500', glow: 'bg-slate-300/35' },
  laptop: { icon: HardDrive, gradient: 'from-slate-950 via-emerald-950 to-emerald-400', glow: 'bg-emerald-300/35' },
  officeScene: { icon: Building2, gradient: 'from-slate-950 via-sky-950 to-amber-400', glow: 'bg-amber-300/35' },
  authHero: { icon: KeyRound, gradient: 'from-slate-950 via-indigo-950 to-cyan-400', glow: 'bg-cyan-300/35' },
  empty: { icon: PackageSearch, gradient: 'from-slate-950 via-slate-800 to-slate-500', glow: 'bg-slate-300/25' },
  command: { icon: Command, gradient: 'from-slate-950 via-indigo-950 to-violet-400', glow: 'bg-violet-300/35' },
  lowStock: { icon: Package, gradient: 'from-slate-950 via-amber-950 to-orange-400', glow: 'bg-orange-300/35' },
  offboarding: { icon: CheckCircle2, gradient: 'from-slate-950 via-emerald-950 to-lime-400', glow: 'bg-lime-300/35' }
};

export function Visual({
  name,
  size = 40,
  className,
  imageClassName
}: {
  name: VisualName;
  alt?: string;
  size?: number;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
}) {
  const item = visualMap[name];
  const Icon = item.icon;

  return (
    <span
      aria-hidden="true"
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/70 bg-gradient-to-br shadow-[0_14px_34px_rgba(15,23,42,0.14)] ring-1 ring-slate-950/[0.04]',
        item.gradient,
        className
      )}
      style={{ width: size, height: size }}
    >
      <span className={cn('absolute -right-1 -top-1 h-1/2 w-1/2 rounded-full blur-xl', item.glow)} />
      <span className="absolute inset-x-2 top-1 h-px bg-white/45" />
      <span className="absolute left-2 top-2 h-1.5 w-1.5 rounded-full bg-white/55" />
      <Icon className={cn('relative z-10 text-white drop-shadow-sm', imageClassName)} style={{ width: Math.max(16, size * 0.46), height: Math.max(16, size * 0.46) }} strokeWidth={1.9} />
    </span>
  );
}
